import { connectDatabase } from '../src/database';
import { LedgerEntry } from '../src/modules/ledgerEntry/LedgerEntryModel';
import { deleteCollections } from './utils/collectionUtils';

async function run() {
  await connectDatabase();

  await deleteCollections([{ Model: LedgerEntry, name: 'LedgerEntries' }]);

  process.exit(0);
}

run();
