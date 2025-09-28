"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLedgerEntriesJob = void 0;
const graphql_relay_1 = require("graphql-relay");
const LedgerEntryModel_1 = require("../LedgerEntryModel");
const PixTransactionModel_1 = require("../../pix/PixTransactionModel");
const ledgerEntryEnum_1 = require("../ledgerEntryEnum");
const pixTransactionEnum_1 = require("../../pix/pixTransactionEnum");
const accountService_1 = require("../../account/accountService");
const pixTransactionStatusEnum_1 = require("../../pix/mutations/pixTransactionStatusEnum");
const createLedgerEntriesJob = async (job) => {
    const { pixTransactionId } = job.data;
    // console.log(`🔄 Processando job ledger: ${job.id} - PIX: ${pixTransactionId}`);
    // 1. Verificar se já existem entradas para esta idempotencyKey
    const existingEntries = await LedgerEntryModel_1.LedgerEntry.find({
        pixTransaction: pixTransactionId
    });
    if (existingEntries.length > 0) {
        console.log(`⚠️  Entradas do ledger já existem para PIX: ${pixTransactionId}`);
        return {
            error: pixTransactionStatusEnum_1.PixTransactionStatus.ALREADY_PROCESSED,
        }; // Job já foi processado
    }
    const pixTransaction = await PixTransactionModel_1.PixTransaction.findOne({
        _id: pixTransactionId
    });
    if (!pixTransaction) {
        console.log(`❌ PIX transaction not found: ${pixTransactionId}`);
        return {
            error: pixTransactionStatusEnum_1.PixTransactionStatus.NOT_FOUND,
        };
    }
    // 2. Criar as duas entradas contábeis (DEBIT e CREDIT)
    const ledgerEntries = [
        {
            value: pixTransaction.value,
            type: ledgerEntryEnum_1.ledgerEntryEnum.DEBIT,
            status: pixTransactionEnum_1.pixTransactionEnum.CREATED,
            ledgerAccount: {
                account: pixTransaction.debitParty.account,
                psp: pixTransaction.debitParty.psp,
                type: pixTransaction.debitParty.type,
                pixKey: pixTransaction.debitParty.pixKey
            },
            description: pixTransaction.description,
            pixTransaction: pixTransactionId,
            idempotencyKey: pixTransaction.idempotencyKey,
        },
        {
            value: pixTransaction.value,
            type: ledgerEntryEnum_1.ledgerEntryEnum.CREDIT,
            status: pixTransactionEnum_1.pixTransactionEnum.CREATED,
            ledgerAccount: {
                account: pixTransaction.creditParty.account,
                psp: pixTransaction.creditParty.psp,
                type: pixTransaction.creditParty.type,
                pixKey: pixTransaction.creditParty.pixKey
            },
            description: pixTransaction.description,
            pixTransaction: pixTransactionId,
            idempotencyKey: pixTransaction.idempotencyKey,
        }
    ];
    const createdEntries = await LedgerEntryModel_1.LedgerEntry.insertMany(ledgerEntries);
    console.log(`✅ Criadas ${createdEntries.length} entradas no ledger`);
    // 3. Atualizar saldos das contas usando sua função updateAccountBalances
    // Decodificar os Global IDs para ObjectIds
    const debitAccountId = (0, graphql_relay_1.fromGlobalId)(pixTransaction.debitParty.account).id;
    const creditAccountId = (0, graphql_relay_1.fromGlobalId)(pixTransaction.creditParty.account).id;
    const balanceUpdates = [
        {
            accountId: debitAccountId,
            value: pixTransaction.value,
            operation: ledgerEntryEnum_1.ledgerEntryEnum.DEBIT
        },
        {
            accountId: creditAccountId,
            value: pixTransaction.value,
            operation: ledgerEntryEnum_1.ledgerEntryEnum.CREDIT
        }
    ];
    const bulkResult = await (0, accountService_1.updateAccountBalances)(balanceUpdates);
    console.log(`✅ Saldos atualizados - Modificados: ${bulkResult.modifiedCount}`);
    if (bulkResult.modifiedCount !== 2) {
        return {
            error: 'Falha ao atualizar saldos das contas',
        };
    }
    console.log(`✅ Job ledger processado com sucesso: ${job.id}`);
};
exports.createLedgerEntriesJob = createLedgerEntriesJob;
