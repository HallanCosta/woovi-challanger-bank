import { PixTransactionError } from "./pixTransactionErrorEnum";

export const ERROR_MESSAGES = {
  [PixTransactionError.INVALID_DEBIT_ACCOUNT_ID]: 'ID da conta de débito inválido ou malformado',
  [PixTransactionError.INVALID_CREDIT_ACCOUNT_ID]: 'ID da conta de crédito inválido ou malformado',
  [PixTransactionError.INSUFFICIENT_BALANCE]: 'Saldo insuficiente para realizar a transação PIX',
  [PixTransactionError.DEBIT_ACCOUNT_NOT_FOUND]: 'Conta de débito não encontrada no sistema',
  [PixTransactionError.CREDIT_ACCOUNT_NOT_FOUND]: 'Conta de crédito não encontrada no sistema',
  [PixTransactionError.LEDGER_ENTRY_CREATION_FAILED]: 'Falha ao criar entradas contábeis da transação',
  [PixTransactionError.BALANCE_UPDATE_FAILED]: 'Falha ao atualizar saldo das contas',
  [PixTransactionError.INVALID_TRANSACTION_VALUE]: 'O valor do PIX não pode ser menor que R$ 0,01',
  [PixTransactionError.MISSING_REQUIRED_FIELDS]: 'Campos obrigatórios não fornecidos',
  [PixTransactionError.TRANSACTION_FAILED]: 'Falha na execução da transação PIX',
  [PixTransactionError.FAILED_TO_CREATE_PIX_TRANSACTION]: 'Falha ao criar transação PIX',
  [PixTransactionError.FAILED_TO_CREATE_DEBIT_LEDGER_ENTRY]: 'Falha ao criar entrada contábil de débito',
  [PixTransactionError.FAILED_TO_CREATE_CREDIT_LEDGER_ENTRY]: 'Falha ao criar entrada contábil de crédito',
  [PixTransactionError.FAILED_TO_UPDATE_ACCOUNT_BALANCES]: 'Falha ao atualizar saldo das contas',
};