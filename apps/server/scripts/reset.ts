import { connectDatabase } from '../src/database';
import { Account } from '../src/modules/account/AccountModel';
import { LedgerEntry } from '../src/modules/ledgerEntry/LedgerEntryModel';
import { deleteCollections } from './utils/collectionUtils';

async function run() {
  await connectDatabase();

  await deleteCollections([
    { Model: Account, name: 'Contas' },
    { Model: LedgerEntry, name: 'LedgerEntries' }
  ]);

  process.exit(0);
}

run();