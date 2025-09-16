import mongoose from 'mongoose';
import { Account } from '../modules/account/AccountModel';
import { updateAccountBalance, hasSufficientBalance, ACCOUNT_NOT_FOUND_MESSAGE } from '../modules/account/accountService';
import { ledgerEntryEnum } from '../modules/ledgerEntry/ledgerEntryEnum';
import { createAccount } from './setup/fixtures/createAccount';
import { setupDatabase } from './setup';

setupDatabase();

it('should debit amount from account correctly', async () => {
  const account1 = await createAccount({ });
  const initialBalance = account1.balance;
  const debitAmount = 200;

  const updatedAccount = await updateAccountBalance({
    accountId: account1._id.toString(),
    amount: debitAmount,
    operation: ledgerEntryEnum.DEBIT
  });

  expect(updatedAccount.balance).toBe(initialBalance - debitAmount);
});

it('should credit amount to account correctly', async () => {
  const account1 = await createAccount({ });
  const initialBalance = account1.balance;
  const creditAmount = 300;

  const updatedAccount = await updateAccountBalance({
    accountId: account1._id.toString(),
    amount: creditAmount,
    operation: ledgerEntryEnum.CREDIT
  });

  expect(updatedAccount.balance).toBe(initialBalance + creditAmount);
});

it('should check sufficient balance correctly', async () => {
  const account1 = await createAccount({ });
  const hasBalance = await hasSufficientBalance(account1._id.toString(), 500);
  expect(hasBalance).toBe(true);
});

it('should check insufficient balance correctly', async () => {
  const account1 = await createAccount({ });
  const hasInsufficientBalance = await hasSufficientBalance(account1._id.toString(), 5000);
  expect(hasInsufficientBalance).toBe(false);
});

it('should throw error for non-existent account', async () => {
  const nonExistentId = new mongoose.Types.ObjectId().toString();

  await expect(
    updateAccountBalance({
      accountId: nonExistentId,
      amount: 100,
      operation: ledgerEntryEnum.DEBIT
    })
  ).rejects.toThrow(ACCOUNT_NOT_FOUND_MESSAGE);
});