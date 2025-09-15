import mongoose from 'mongoose';
import { Account } from '../modules/account/AccountModel';
import { updateAccountBalance } from '../modules/account/accountService';
import { ledgerEntryEnum } from '../modules/ledgerEntry/ledgerEntryEnum';
import { createAccount } from './setup/fixtures/createAccount';
import { setupDatabase } from './setup';

// Setup do banco de dados para todos os testes deste arquivo
setupDatabase();

it('should maintain data consistency between ledger entries and account balances', async () => {
  const account1 = await createAccount({ balance: 1000 });
  const account2 = await createAccount({ balance: 500 });
  const transactionAmount = 200;
  
  // Simular uma transação PIX (débito da conta 1, crédito na conta 2)
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

  // Atualizar saldos
  await Promise.all(
    balanceUpdates.map(update => 
      updateAccountBalance(update)
    )
  );

  // Verificar se os saldos foram atualizados corretamente
  const updatedAccount1 = await Account.findById(account1._id);
  const updatedAccount2 = await Account.findById(account2._id);

  if (!updatedAccount1 || !updatedAccount2) {
    throw new Error('Contas não encontradas para verificação de saldo');
  }

  expect(updatedAccount1.balance).toBe(1000 - transactionAmount);
  expect(updatedAccount2.balance).toBe(500 + transactionAmount);
});
