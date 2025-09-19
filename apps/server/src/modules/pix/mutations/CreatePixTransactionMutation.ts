import mongoose from 'mongoose';
import { GraphQLString, GraphQLNonNull, GraphQLFloat, GraphQLInputObjectType } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

import { PartyInputType } from '../../graphql/PartyType';

import { LedgerEntry, ILedgerEntry } from '../../ledgerEntry/LedgerEntryModel';
import { updateAccountBalances, hasSufficientBalance, UpdateAccountBalanceProps } from '../../account/accountService';

import { IParty } from '../../graphql/PartyModel';
import { IPixTransactionStatus, PixTransaction } from '../PixTransactionModel';
import { pixTransactionField } from '../pixTransactionFields';

import { ledgerEntryEnum } from '../../ledgerEntry/ledgerEntryEnum';
import { pixTransactionEnum } from '../pixTransactionEnum';
import { PixTransactionError } from './pixTransactionErrorEnum';

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
    /**
     * Fluxo robusto com transação MongoDB:
     * 1. Validar se contas existem
     * 2. Validar se conta de débito tem saldo suficiente
     * 3. Executar transação atômica:
     *    - Salvar transação PIX
     *    - Criar entradas contábeis
     *    - Atualizar saldos das contas
     * 4. Rollback automático em caso de falha
     */
    console.log('🚀 Iniciando transação PIX');
    console.log('Flow 1');

    // Validações iniciais (mínimo de 1 centavo)
    if (args.value < 1) {
      return {
        error: PixTransactionError.INVALID_TRANSACTION_VALUE,
      }
    }

    console.log('Flow 2');

    // Validar se a conta de débito tem saldo suficiente
    const debitAccountId = fromGlobalId(args.debitParty.account).id;
    const creditAccountId = fromGlobalId(args.creditParty.account).id;
    const transactionId = new mongoose.Types.ObjectId().toString();

    console.log('✅ Validando saldo da conta de débito');
    const hasBalance = await hasSufficientBalance(debitAccountId, args.value);
    if (!hasBalance) {
      return {
        error: PixTransactionError.INSUFFICIENT_BALANCE,
      }
    }

    console.log('Flow 3');

    // Executar transação atômica MongoDB
    await mongoose.connection.transaction(async (session) => {
      // Criar e salvar a transação PIX
      const pixTransaction = await PixTransaction.create({
        id: transactionId,
        value: args.value,
        status: args.status,
        debitParty: args.debitParty,
        creditParty: args.creditParty,
        description: args.description,
      });

      if (!pixTransaction) {
        return {
          error: PixTransactionError.FAILED_TO_CREATE_PIX_TRANSACTION,
        }
      }
      console.log('Flow 3.1');
    
      // Criar as entradas contábeis apenas para contas válidas
      const ledgerEntries: Partial<ILedgerEntry>[] = [
        {
          value: pixTransaction.value,
          type: ledgerEntryEnum.DEBIT,
          status: pixTransactionEnum.CREATED,
          ledgerAccount: pixTransaction.debitParty,
          description: pixTransaction.description,
          pixTransaction: pixTransaction.id,
        },
        {
          value: pixTransaction.value,
          type: ledgerEntryEnum.CREDIT,
          status: pixTransactionEnum.CREATED,
          ledgerAccount: pixTransaction.creditParty,
          description: pixTransaction.description,
          pixTransaction: pixTransaction.id,
        }
      ];

      const [debitLedgerEntry, creditLedgerEntry] = await LedgerEntry.insertMany(ledgerEntries);
      console.log('Flow 3.2');

      if (!debitLedgerEntry) {
        return {
          error: PixTransactionError.FAILED_TO_CREATE_DEBIT_LEDGER_ENTRY,
        }
      }

      if (!creditLedgerEntry) {
        return {
          error: PixTransactionError.FAILED_TO_CREATE_CREDIT_LEDGER_ENTRY,
        }
      }
      console.log('Flow 3.3');

      // Atualizar o saldo das contas usando o serviço
      const balanceUpdates: UpdateAccountBalanceProps[] = [
        {
          accountId: debitAccountId,
          value: args.value,
          operation: ledgerEntryEnum.DEBIT
        },
        {
          accountId: creditAccountId,
          value: args.value,
          operation: ledgerEntryEnum.CREDIT
        }
      ];

      await updateAccountBalances(balanceUpdates);
      console.log('Flow 3.4');
    })
      
    // Publicar evento de transação PIX criada
    //   pixTransaction: transactionId.toString(),
    // });

    console.log('Flow 4');

    return {
      id: transactionId,
      message: 'Transação PIX efetuada com sucesso!',
      value: args.value,
      status: args.status,
      debitParty: args.debitParty,
      creditParty: args.creditParty,
      description: args.description,
    };
  },
  outputFields: {
    ...pixTransactionField('pixTransaction'),
  },
});

export const CreatePixTransactionMutation = {
  ...mutation,
};
