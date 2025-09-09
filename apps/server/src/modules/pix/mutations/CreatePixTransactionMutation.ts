import mongoose from 'mongoose';
import { GraphQLString, GraphQLNonNull, GraphQLFloat, GraphQLInputObjectType } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

import { PartyInputType } from '../../graphql/PartyType';

import { IParty, LedgerEntry, ILedgerEntry } from '../../ledgerEntry/LedgerEntryModel';
import { ledgerEntryEnum } from '../../ledgerEntry/ledgerEntryEnum';
import { updateMultipleAccountBalances, hasSufficientBalance, UpdateBalanceParams } from '../../account/accountService';

import { pixTransactionField } from '../pixTransactionFields';
import { pixTransactionEnum } from '../pixTransactionEnum';
import { IPixTransactionStatus } from '../PixTransactionModal';

// Enum para tipos de erro
enum PixTransactionError {
  INVALID_DEBIT_ACCOUNT_ID = 'INVALID_DEBIT_ACCOUNT_ID',
  INVALID_CREDIT_ACCOUNT_ID = 'INVALID_CREDIT_ACCOUNT_ID',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  DEBIT_ACCOUNT_NOT_FOUND = 'DEBIT_ACCOUNT_NOT_FOUND',
  CREDIT_ACCOUNT_NOT_FOUND = 'CREDIT_ACCOUNT_NOT_FOUND',
  LEDGER_ENTRY_CREATION_FAILED = 'LEDGER_ENTRY_CREATION_FAILED',
  BALANCE_UPDATE_FAILED = 'BALANCE_UPDATE_FAILED',
  INVALID_TRANSACTION_VALUE = 'INVALID_TRANSACTION_VALUE',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS'
}

// Mensagens de erro personalizadas
const ERROR_MESSAGES = {
  [PixTransactionError.INVALID_DEBIT_ACCOUNT_ID]: 'ID da conta de débito inválido ou malformado',
  [PixTransactionError.INVALID_CREDIT_ACCOUNT_ID]: 'ID da conta de crédito inválido ou malformado',
  [PixTransactionError.INSUFFICIENT_BALANCE]: 'Saldo insuficiente para realizar a transação PIX',
  [PixTransactionError.DEBIT_ACCOUNT_NOT_FOUND]: 'Conta de débito não encontrada no sistema',
  [PixTransactionError.CREDIT_ACCOUNT_NOT_FOUND]: 'Conta de crédito não encontrada no sistema',
  [PixTransactionError.LEDGER_ENTRY_CREATION_FAILED]: 'Falha ao criar entradas contábeis da transação',
  [PixTransactionError.BALANCE_UPDATE_FAILED]: 'Falha ao atualizar saldo das contas',
  [PixTransactionError.INVALID_TRANSACTION_VALUE]: 'O valor do PIX não pode ser menor que R$ 0,01',
  [PixTransactionError.MISSING_REQUIRED_FIELDS]: 'Campos obrigatórios não fornecidos'
};

// Função para criar erro personalizado
function createPixError(errorType: PixTransactionError, details?: string): Error {
  const message = ERROR_MESSAGES[errorType];
  const fullMessage = details ? `${message}: ${details}` : message;
  const error = new Error(fullMessage);
  error.name = errorType;
  return error;
}

export type CreatePixTransactionInput = {
  value: number;
  status: IPixTransactionStatus;
  debitParty: IParty;
  creditParty: IParty;
  description: string;
};

const mutation = mutationWithClientMutationId({
  name: 'CreatePixTransaction',
  inputFields: {
    value: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    debitParty: {
      type: new GraphQLNonNull(PartyInputType),
    },
    creditParty: {
      type: new GraphQLNonNull(PartyInputType),
    },
    description: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (args: CreatePixTransactionInput) => {
    const transactionId = new mongoose.Types.ObjectId().toString();

    // Converter valor recebido (em centavos) para reais
    const centsValue = Math.round(args.value as unknown as number);
    const realValue = centsValue / 100;

    // Validações iniciais (mínimo de 1 centavo)
    if (!centsValue || centsValue < 1) {
      throw createPixError(PixTransactionError.INVALID_TRANSACTION_VALUE);
    }

    if (!args.debitParty || !args.creditParty) {
      throw createPixError(PixTransactionError.MISSING_REQUIRED_FIELDS, 'debitParty e creditParty são obrigatórios');
    }

    // Validar existência de chave PIX do destinatário
    if (!args.creditParty.pixKey || !args.creditParty.pixKey.trim()) {
      throw createPixError(PixTransactionError.MISSING_REQUIRED_FIELDS, 'chave PIX do destinatário é obrigatória');
    }

    // Validar se a conta de débito tem saldo suficiente
    if (args.debitParty.account) {
      try {
        // Decodificar o ID global para obter o ObjectId
        const { id: accountId } = fromGlobalId(args.debitParty.account);
        
        if (!accountId) {
          throw createPixError(PixTransactionError.INVALID_DEBIT_ACCOUNT_ID);
        }
        
        const hasBalance = await hasSufficientBalance(accountId, realValue);
        if (!hasBalance) {
          throw createPixError(PixTransactionError.INSUFFICIENT_BALANCE, `Valor solicitado: R$ ${realValue.toFixed(2)}`);
        }
      } catch (error: any) {
        if (error.name === PixTransactionError.INVALID_DEBIT_ACCOUNT_ID || 
            error.name === PixTransactionError.INSUFFICIENT_BALANCE) {
          throw error;
        }
        throw createPixError(PixTransactionError.DEBIT_ACCOUNT_NOT_FOUND, error.message);
      }
    }

    // Criar as entradas contábeis apenas para contas válidas
    const ledgerEntries: Partial<ILedgerEntry>[] = [];
    
    // Criar entrada de débito se houver conta de débito
    if (args.debitParty.account) {
      ledgerEntries.push({
        value: realValue,
        type: ledgerEntryEnum.DEBIT,
        status: pixTransactionEnum.CREATED,
        ledgerAccount: args.debitParty,
        description: args.description,
        pixTransaction: transactionId.toString(),
      });
    }
    
    // Criar entrada de crédito se houver conta de crédito
    if (args.creditParty.account) {
      ledgerEntries.push({
        value: realValue,
        type: ledgerEntryEnum.CREDIT,
        status: pixTransactionEnum.CREATED,
        ledgerAccount: args.creditParty,
        description: args.description,
        pixTransaction: transactionId.toString(),
      });
    }

    // Só criar entradas se houver contas válidas
    let ledgerEntryResults: any[] = [];
    if (ledgerEntries.length > 0) {
      try {
        ledgerEntryResults = await LedgerEntry.insertMany(ledgerEntries);
      } catch (error: any) {
        throw createPixError(PixTransactionError.LEDGER_ENTRY_CREATION_FAILED, error.message);
      }
    }

    // Atualizar o saldo das contas usando o serviço
    try {
      const balanceUpdates: UpdateBalanceParams[] = [];
       
      // Adicionar débito se houver conta de débito
      if (args.debitParty.account) {
        try {
          const debitAccountId = fromGlobalId(args.debitParty.account).id;
          
          if (debitAccountId) {
            balanceUpdates.push({
              accountId: debitAccountId,
              amount: realValue,
              operation: ledgerEntryEnum.DEBIT
            });
          }
        } catch (error: any) {
          throw createPixError(PixTransactionError.INVALID_DEBIT_ACCOUNT_ID, error.message);
        }
      }
      
      // Adicionar crédito se houver conta de crédito
      if (args.creditParty.account) {
        try {
          const creditAccountId = fromGlobalId(args.creditParty.account).id;
          
          if (creditAccountId) {
            balanceUpdates.push({
              accountId: creditAccountId,
              amount: realValue,
              operation: ledgerEntryEnum.CREDIT
            });
          }
        } catch (error: any) {
          throw createPixError(PixTransactionError.INVALID_CREDIT_ACCOUNT_ID, error.message);
        }
      }

      // Só atualizar se houver contas para atualizar
      if (balanceUpdates.length > 0) {
        try {
          await updateMultipleAccountBalances(balanceUpdates);
        } catch (error: any) {
          // Em caso de erro na atualização do saldo, reverter as entradas contábeis
          await LedgerEntry.deleteMany({ pixTransaction: transactionId.toString() });
          throw createPixError(PixTransactionError.BALANCE_UPDATE_FAILED, error.message);
        }
      }

    } catch (error: any) {
      // Se for um erro personalizado, apenas relançar
      if (error.name && Object.values(PixTransactionError).includes(error.name as PixTransactionError)) {
        throw error;
      }
      
      // Em caso de erro inesperado, reverter as entradas contábeis
      await LedgerEntry.deleteMany({ pixTransaction: transactionId.toString() });
      throw createPixError(PixTransactionError.BALANCE_UPDATE_FAILED, error.message);
    }

    // Publicar evento de transação PIX criada
    //   pixTransaction: transactionId.toString(),
    // });

    return {
      id: transactionId.toString(),
      message: 'Transação PIX efetuada com sucesso!',
      value: realValue,
      status: args.status,
      debitParty: args.debitParty,
      creditParty: args.creditParty,
      description: args.description,
    } as any;
  },
  outputFields: {
    ...pixTransactionField('pixTransaction'),
  },
});

export const CreatePixTransactionMutation = {
  ...mutation,
};
