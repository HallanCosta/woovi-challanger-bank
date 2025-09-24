import { PixTransactionStatus } from "./pixTransactionStatusEnum";

export const PixTransactionMessages = {
  [PixTransactionStatus.INVALID_DEBIT_ACCOUNT_ID]: 'ID da conta de débito inválido ou malformado',
  [PixTransactionStatus.INVALID_CREDIT_ACCOUNT_ID]: 'ID da conta de crédito inválido ou malformado',
  [PixTransactionStatus.INSUFFICIENT_BALANCE]: 'Saldo insuficiente para realizar a transação PIX',
  [PixTransactionStatus.DEBIT_ACCOUNT_NOT_FOUND]: 'Conta de débito não encontrada no sistema',
  [PixTransactionStatus.CREDIT_ACCOUNT_NOT_FOUND]: 'Conta de crédito não encontrada no sistema',
  [PixTransactionStatus.LEDGER_ENTRY_CREATION_FAILED]: 'Falha ao criar entradas contábeis da transação',
  [PixTransactionStatus.BALANCE_UPDATE_FAILED]: 'Falha ao atualizar saldo das contas',
  [PixTransactionStatus.INVALID_TRANSACTION_VALUE]: 'O valor do PIX não pode ser menor que R$ 0,01',
  [PixTransactionStatus.MISSING_REQUIRED_FIELDS]: 'Campos obrigatórios não fornecidos',
  [PixTransactionStatus.TRANSACTION_FAILED]: 'Falha na execução da transação PIX',
  [PixTransactionStatus.FAILED_TO_CREATE_PIX_TRANSACTION]: 'Falha ao criar transação PIX',
  [PixTransactionStatus.FAILED_TO_CREATE_DEBIT_LEDGER_ENTRY]: 'Falha ao criar entrada contábil de débito',
  [PixTransactionStatus.FAILED_TO_CREATE_CREDIT_LEDGER_ENTRY]: 'Falha ao criar entrada contábil de crédito',
  [PixTransactionStatus.FAILED_TO_UPDATE_ACCOUNT_BALANCES]: 'Falha ao atualizar saldo das contas',
  [PixTransactionStatus.SUCCESS]: 'Transação PIX efetuada com sucesso!',
};