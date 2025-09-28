import mongoose from 'mongoose';
import { Account, IAccount } from '../modules/account/AccountModel';
import { updateAccountBalances, hasSufficientBalance, ACCOUNT_NOT_FOUND_MESSAGE } from '../modules/account/accountService';
import { ledgerEntryEnum } from '../modules/ledgerEntry/ledgerEntryEnum';
import { createAccount } from './setup/fixtures/createAccount';
import { setupDatabase } from './setup';

setupDatabase();

it('should not allow only debit operation', async () => {
  const account1 = await createAccount({ });
  const debitAmount = 200;

  const updatedAccount = await updateAccountBalances([
    {
      accountId: account1._id.toString(),
      value: debitAmount,
      operation: ledgerEntryEnum.DEBIT
    },
  ]);

  expect(updatedAccount.modifiedCount).toBe(0);
});

it('should not allow only credit operation', async () => {
  const account1 = await createAccount({ });
  const creditAmount = 300;

  const updatedAccount = await updateAccountBalances([
    {
      accountId: account1._id.toString(),
      value: creditAmount,
      operation: ledgerEntryEnum.CREDIT
    }
  ]);

  expect(updatedAccount.modifiedCount).toBe(0);
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
  const nonExistentId2 = new mongoose.Types.ObjectId().toString();

  const updatedAccount = await updateAccountBalances([
    {
      accountId: nonExistentId,
      value: 100,
      operation: ledgerEntryEnum.DEBIT
    },
    {
      accountId: nonExistentId2,
      value: 100,
      operation: ledgerEntryEnum.CREDIT
    }
  ])

  expect(updatedAccount.modifiedCount).toBe(0);
});

it('should update account balances correctly', async () => {
  const value = 100;
  const initialBalance1 = 2500;
  const initialBalance2 = 1500;

  const account1 = await createAccount({ balance: initialBalance1 });
  const account2 = await createAccount({ balance: initialBalance2 });

  const updatedAccount = await updateAccountBalances([
    {
      accountId: account1._id.toString(),
      value,
      operation: ledgerEntryEnum.DEBIT
    },
    {
      accountId: account2._id.toString(),
      value,
      operation: ledgerEntryEnum.CREDIT
    }
  ])

  const account1Updated = await Account.findOne({ _id: account1._id }) as IAccount;
  const account2Updated = await Account.findOne({ _id: account2._id }) as IAccount;

  expect(updatedAccount.modifiedCount).toBe(2);
  expect(account1Updated.balance).toBe(initialBalance1 - value);
  expect(account2Updated.balance).toBe(initialBalance2 + value);
})