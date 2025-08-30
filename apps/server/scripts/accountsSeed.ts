import { Account } from '../src/modules/account/AccountModel';
import { users } from '../src/modules/user/users';

import { connectDatabase } from '../src/database';

async function run() {
  await connectDatabase();

  const accounts = await Account.find();
  if (accounts.length === users.length) {
    console.log('Accounts already seeded');
    process.exit(0);
    return;
  }

  await new Account({
    pixKey: '95b7f30c-2fad-43cd-85d1-f5615cf28a39',
    password: '123',
    user: users[0].id,
  }).save();

  await new Account({
    pixKey: '08771dd3-32c0-4fe7-8725-6175ab14c7ee',
    password: '123',
    user: users[1].id,
  }).save();

  console.log('Accounts seeded successfully');
  process.exit(0);
}

run();