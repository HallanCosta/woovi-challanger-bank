"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PixTransactionMessages = void 0;
const pixTransactionStatusEnum_1 = require("./pixTransactionStatusEnum");
exports.PixTransactionMessages = {
    [pixTransactionStatusEnum_1.PixTransactionStatus.INVALID_DEBIT_ACCOUNT_ID]: 'ID da conta de débito inválido ou malformado',
    [pixTransactionStatusEnum_1.PixTransactionStatus.INVALID_CREDIT_ACCOUNT_ID]: 'ID da conta de crédito inválido ou malformado',
    [pixTransactionStatusEnum_1.PixTransactionStatus.INSUFFICIENT_BALANCE]: 'Saldo insuficiente para realizar a transação PIX',
    [pixTransactionStatusEnum_1.PixTransactionStatus.DEBIT_ACCOUNT_NOT_FOUND]: 'Conta de débito não encontrada no sistema',
    [pixTransactionStatusEnum_1.PixTransactionStatus.CREDIT_ACCOUNT_NOT_FOUND]: 'Conta de crédito não encontrada no sistema',
    [pixTransactionStatusEnum_1.PixTransactionStatus.LEDGER_ENTRY_CREATION_FAILED]: 'Falha ao criar entradas contábeis da transação',
    [pixTransactionStatusEnum_1.PixTransactionStatus.BALANCE_UPDATE_FAILED]: 'Falha ao atualizar saldo das contas',
    [pixTransactionStatusEnum_1.PixTransactionStatus.INVALID_TRANSACTION_VALUE]: 'O valor do PIX não pode ser menor que R$ 0,01',
    [pixTransactionStatusEnum_1.PixTransactionStatus.MISSING_REQUIRED_FIELDS]: 'Campos obrigatórios não fornecidos',
    [pixTransactionStatusEnum_1.PixTransactionStatus.TRANSACTION_FAILED]: 'Falha na execução da transação PIX',
    [pixTransactionStatusEnum_1.PixTransactionStatus.FAILED_TO_CREATE_PIX_TRANSACTION]: 'Falha ao criar transação PIX',
    [pixTransactionStatusEnum_1.PixTransactionStatus.FAILED_TO_CREATE_DEBIT_LEDGER_ENTRY]: 'Falha ao criar entrada contábil de débito',
    [pixTransactionStatusEnum_1.PixTransactionStatus.FAILED_TO_CREATE_CREDIT_LEDGER_ENTRY]: 'Falha ao criar entrada contábil de crédito',
    [pixTransactionStatusEnum_1.PixTransactionStatus.FAILED_TO_UPDATE_ACCOUNT_BALANCES]: 'Falha ao atualizar saldo das contas',
    [pixTransactionStatusEnum_1.PixTransactionStatus.SUCCESS]: 'Transação PIX efetuada com sucesso!',
    [pixTransactionStatusEnum_1.PixTransactionStatus.FAILED_TO_CREATE_JOB]: 'Falha ao criar job na fila ledger',
    [pixTransactionStatusEnum_1.PixTransactionStatus.NOT_FOUND]: 'Transação PIX não encontrada',
    [pixTransactionStatusEnum_1.PixTransactionStatus.ALREADY_PROCESSED]: 'Transação PIX já foi processada anteriormente!',
};
