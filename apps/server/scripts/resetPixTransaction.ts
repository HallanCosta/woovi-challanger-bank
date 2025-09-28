import { connectDatabase } from '../src/database';
import { PixTransaction } from '../src/modules/pix/PixTransactionModel';
import { deleteCollections } from './utils/collectionUtils';

async function run() {
  await connectDatabase();

  await deleteCollections([{ Model: PixTransaction, name: 'PixTransactions' }]);

  process.exit(0);
}

run();
