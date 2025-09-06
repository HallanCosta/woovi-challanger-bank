import { connectDatabase } from '../src/database';

import { Account } from '../src/modules/account/AccountModel';
import { LedgerEntry } from '../src/modules/ledgerEntry/LedgerEntryModel';


async function deleteCollection(Model: any, name: string) {
  const count = await Model.countDocuments();
  
  if (count > 0) {
    await Model.deleteMany({});
    console.log(`${name} deletadas com sucesso`);
  } else {
    console.log(`Não há ${name} para deletar`);
  }
}

async function run() {
  await connectDatabase();

  await deleteCollection(Account, 'Contas');
  await deleteCollection(LedgerEntry, 'LedgerEntries');

  process.exit(0);
}

run();