import { connectDatabase } from '../src/database';
import { Account } from '../src/modules/account/AccountModel';

async function run() {
  await connectDatabase();

  // PixKeys das contas usadas no teste K6
  const account1PixKey = '95b7f30c-2fad-43cd-85d1-f5615cf28a39';
  const account2PixKey = '08771dd3-32c0-4fe7-8725-6175ab14c7ee';
  
  // Valor em centavos (10 milhões de reais = 1.000.000.000 centavos)
  const newBalance = 1000000000;

  try {
    // Atualizar Account 1
    const account1 = await Account.findOne({ pixKey: account1PixKey });
    if (account1) {
      const oldBalance1 = account1.balance;
      await Account.updateOne({ pixKey: account1PixKey }, { balance: newBalance });
      console.log('✅ Account 1 atualizada!');
      console.log(`💰 Conta: ${account1PixKey}`);
      console.log(`📊 Saldo anterior: R$ ${(oldBalance1 / 100).toFixed(2)}`);
      console.log(`📊 Saldo novo: R$ ${(newBalance / 100).toFixed(2)}`);
    } else {
      console.error('❌ Account 1 não encontrada:', account1PixKey);
    }

    // Atualizar Account 2
    const account2 = await Account.findOne({ pixKey: account2PixKey });
    if (account2) {
      const oldBalance2 = account2.balance;
      await Account.updateOne({ pixKey: account2PixKey }, { balance: newBalance });
      console.log('✅ Account 2 atualizada!');
      console.log(`💰 Conta: ${account2PixKey}`);
      console.log(`📊 Saldo anterior: R$ ${(oldBalance2 / 100).toFixed(2)}`);
      console.log(`📊 Saldo novo: R$ ${(newBalance / 100).toFixed(2)}`);
    } else {
      console.error('❌ Account 2 não encontrada:', account2PixKey);
    }

    console.log('🎉 Reset de contas concluído!');

  } catch (error) {
    console.error('❌ Erro ao atualizar saldos:', error);
    process.exit(1);
  }

  process.exit(0);
}

run();
