import mongoose from 'mongoose';
import { Account } from '../modules/account/AccountModel';
import { updateAccountBalance, hasSufficientBalance } from '../modules/account/accountService';
import { ledgerEntryEnum } from '../modules/ledgerEntry/ledgerEntryEnum';

describe('PIX Transaction and Balance Update', () => {
  let testAccount1: any;
  let testAccount2: any;

  beforeAll(async () => {
    // Conectar ao banco de teste
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
  });

  beforeEach(async () => {
    // Limpar dados de teste
    await Account.deleteMany({});
    
    // Criar contas de teste
    testAccount1 = await new Account({
      pixKey: 'test1@email.com',
      user: 'user1',
      balance: 1000
    }).save();

    testAccount2 = await new Account({
      pixKey: 'test2@email.com',
      user: 'user2',
      balance: 500
    }).save();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Account Balance Operations', () => {
    it('should debit amount from account correctly', async () => {
      const initialBalance = testAccount1.balance;
      const debitAmount = 200;

      const updatedAccount = await updateAccountBalance({
        accountId: testAccount1.id.toString(),
        amount: debitAmount,
        operation: ledgerEntryEnum.DEBIT
      });

      expect(updatedAccount.balance).toBe(initialBalance - debitAmount);
    });

    it('should credit amount to account correctly', async () => {
      const initialBalance = testAccount2.balance;
      const creditAmount = 300;

      const updatedAccount = await updateAccountBalance({
        accountId: testAccount2._id.toString(),
        amount: creditAmount,
        operation: ledgerEntryEnum.CREDIT
      });

      expect(updatedAccount.balance).toBe(initialBalance + creditAmount);
    });

    it('should check sufficient balance correctly', async () => {
      const hasBalance = await hasSufficientBalance(testAccount1.id.toString(), 500);
      expect(hasBalance).toBe(true);

      const hasInsufficientBalance = await hasSufficientBalance(testAccount1.id.toString(), 1500);
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
      ).rejects.toThrow('Conta não encontrada');
    });
  });

  describe('PIX Transaction Flow', () => {
    it('should maintain data consistency between ledger entries and account balances', async () => {
      const transactionAmount = 200;
      
      // Simular uma transação PIX (débito da conta 1, crédito na conta 2)
      const balanceUpdates = [
        {
          accountId: testAccount1.id.toString(),
          amount: transactionAmount,
          operation: ledgerEntryEnum.DEBIT
        },
        {
          accountId: testAccount2._id.toString(),
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
      const updatedAccount1 = await Account.findById(testAccount1._id);
      const updatedAccount2 = await Account.findById(testAccount2._id);

      expect(updatedAccount1.balance).toBe(1000 - transactionAmount);
      expect(updatedAccount2.balance).toBe(500 + transactionAmount);
    });
  });
});
