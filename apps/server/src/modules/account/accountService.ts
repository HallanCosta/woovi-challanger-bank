import { Account } from './AccountModel';
import { ledgerEntryEnum } from '../ledgerEntry/ledgerEntryEnum';

export const ACCOUNT_NOT_FOUND_MESSAGE = 'Conta não encontrada';

export type UpdateAccountBalanceProps = {
  accountId: string;
  value: number;
  operation: ledgerEntryEnum.DEBIT | ledgerEntryEnum.CREDIT;
}

/**
 * Atualiza o saldo de múltiplas contas em uma transação
 * @param updates - Array de atualizações de saldo
 * @param session - Sessão MongoDB opcional para transações
 * @returns Promise com as contas atualizadas
 */
export async function updateAccountBalances(updates: UpdateAccountBalanceProps[], session?: any) {
  const options = session ? { session } : {};

  if (updates.length < 2) {
    return {
      modifiedCount: 0,
    };
  }

  const hasDebit = updates.some(update => update.operation === ledgerEntryEnum.DEBIT);
  const hasCredit = updates.some(update => update.operation === ledgerEntryEnum.CREDIT);

  if (!hasDebit || !hasCredit) {
    return {
      modifiedCount: 0,
    };
  }
  
  return await Account.bulkWrite(
    updates.map(({ accountId, value, operation }) => {
      const multiplier = operation === ledgerEntryEnum.DEBIT ? -1 : 1

      return {
        updateOne: {
          filter: { _id: accountId },
          update: { $inc: { balance: value * multiplier } }
        }
      }
    }),
    options
  )
}

/**
 * Verifica se uma conta tem saldo suficiente para uma operação
 * @param accountId - ID da conta
 * @param value - Valor a ser debitado
 * @returns Promise com boolean indicando se há saldo suficiente
 */
export async function hasSufficientBalance(accountId: string, value: number, session?: any): Promise<boolean> {
  const options = session ? { session } : undefined;
  const account = await Account.findOne({ _id: accountId }, undefined, options);
  
  if (!account) {
    return false;
  }

  return account.balance >= value;
}

/**
 * Verifica se uma conta existe
 * @param accountId - ID da conta
 * @param session - Sessão MongoDB opcional para transações
 * @returns Promise com boolean indicando se a conta existe
 */
export async function accountExists(accountId: string, session?: any): Promise<boolean> {
  const options = session ? { session } : undefined;
  const account = await Account.findOne({ _id: accountId }, undefined, options);
  
  return !!account;
}