import mongoose from 'mongoose';
import { Account } from '../modules/account/AccountModel';
import { updateAccountBalances } from '../modules/account/accountService';
import { ledgerEntryEnum } from '../modules/ledgerEntry/ledgerEntryEnum';
import { createAccount } from './setup/fixtures/createAccount';
import { setupDatabase } from './setup';

setupDatabase();

it('should be able to update multiple account balances in a pix transaction', async () => {
  const account1 = await createAccount({ balance: 1000 });
  const account2 = await createAccount({ balance: 500 });
  const transactionAmount = 200;
  
  const balanceUpdates = [
    {
      accountId: account1._id.toString(),
      amount: transactionAmount,
      operation: ledgerEntryEnum.DEBIT
    },
    {
      accountId: account2._id.toString(),
      amount: transactionAmount,
      operation: ledgerEntryEnum.CREDIT
    }
  ];

  await updateAccountBalances(balanceUpdates);

  const updatedAccount1 = await Account.findOne({ _id: account1._id });
  const updatedAccount2 = await Account.findOne({ _id: account2._id });

  if (!updatedAccount1 || !updatedAccount2) {
    throw new Error('Contas não encontradas para verificação de saldo');
  }

  expect(updatedAccount1.balance).toBe(1000 - transactionAmount);
  expect(updatedAccount2.balance).toBe(500 + transactionAmount);
});
