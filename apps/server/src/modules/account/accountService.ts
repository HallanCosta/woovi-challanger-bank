import { Account } from './AccountModel';
import { ledgerEntryEnum } from '../ledgerEntry/ledgerEntryEnum';

export const ACCOUNT_NOT_FOUND_MESSAGE = 'Conta não encontrada';

export type UpdateBalanceParams = {
  accountId: string;
  amount: number;
  operation: ledgerEntryEnum.DEBIT | ledgerEntryEnum.CREDIT;
}

/**
 * Atualiza o saldo de uma conta
 * @param accountId - ID da conta
 * @param amount - Valor a ser debitado ou creditado
 * @param operation - Tipo de operação (debit ou credit)
 * @returns Promise com a conta atualizada
 */
export async function updateAccountBalance({
  accountId,
  amount,
  operation
}: UpdateBalanceParams) {
  const multiplier = operation === ledgerEntryEnum.DEBIT ? -1 : 1;
  
  const updatedAccount = await Account.findByIdAndUpdate(
    accountId,
    { $inc: { balance: amount * multiplier } },
    { new: true, runValidators: true }
  );

  if (!updatedAccount) {
    throw new Error(`${ACCOUNT_NOT_FOUND_MESSAGE}: ${accountId}`);
  }

  return updatedAccount;
}

/**
 * Atualiza o saldo de múltiplas contas em uma transação
 * @param updates - Array de atualizações de saldo
 * @returns Promise com as contas atualizadas
 */
export async function updateMultipleAccountBalances(updates: UpdateBalanceParams[]) {
  const results: any[] = [];

  for (const update of updates) {
    try {
      const result = await updateAccountBalance(update);
      results.push(result);
    } catch (error) {
      throw new Error(`Erro ao atualizar conta ${update.accountId}: ${(error as Error).message}`);
    }
  }

  return results;
}

/**
 * Verifica se uma conta tem saldo suficiente para uma operação
 * @param accountId - ID da conta
 * @param amount - Valor a ser debitado
 * @returns Promise com boolean indicando se há saldo suficiente
 */
export async function hasSufficientBalance(accountId: string, amount: number): Promise<boolean> {
  const account = await Account.findById(accountId);
  
  if (!account) {
    throw new Error(`${ACCOUNT_NOT_FOUND_MESSAGE}: ${accountId}`);
  }

  return account.balance >= amount;
}
