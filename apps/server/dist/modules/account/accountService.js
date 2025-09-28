"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCOUNT_NOT_FOUND_MESSAGE = void 0;
exports.updateAccountBalances = updateAccountBalances;
exports.hasSufficientBalance = hasSufficientBalance;
const AccountModel_1 = require("./AccountModel");
const ledgerEntryEnum_1 = require("../ledgerEntry/ledgerEntryEnum");
exports.ACCOUNT_NOT_FOUND_MESSAGE = 'Conta não encontrada';
/**
 * Atualiza o saldo de múltiplas contas em uma transação
 * @param updates - Array de atualizações de saldo
 * @param session - Sessão MongoDB opcional para transações
 * @returns Promise com as contas atualizadas
 */
async function updateAccountBalances(updates, session) {
    const options = session ? { session } : {};
    if (updates.length < 2) {
        return {
            modifiedCount: 0,
        };
    }
    const hasDebit = updates.some(update => update.operation === ledgerEntryEnum_1.ledgerEntryEnum.DEBIT);
    const hasCredit = updates.some(update => update.operation === ledgerEntryEnum_1.ledgerEntryEnum.CREDIT);
    if (!hasDebit || !hasCredit) {
        return {
            modifiedCount: 0,
        };
    }
    return await AccountModel_1.Account.bulkWrite(updates.map(({ accountId, value, operation }) => {
        const multiplier = operation === ledgerEntryEnum_1.ledgerEntryEnum.DEBIT ? -1 : 1;
        return {
            updateOne: {
                filter: { _id: accountId },
                update: { $inc: { balance: value * multiplier } }
            }
        };
    }), options);
}
/**
 * Verifica se uma conta tem saldo suficiente para uma operação
 * @param accountId - ID da conta
 * @param value - Valor a ser debitado
 * @returns Promise com boolean indicando se há saldo suficiente
 */
async function hasSufficientBalance(accountId, value, session) {
    const options = session ? { session } : undefined;
    const account = await AccountModel_1.Account.findOne({ _id: accountId }, undefined, options);
    if (!account) {
        return false;
    }
    return account.balance >= value;
}
