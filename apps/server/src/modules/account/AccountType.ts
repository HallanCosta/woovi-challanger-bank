import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import type { ConnectionArguments } from 'graphql-relay';

import { IAccount } from './AccountModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
import { AccountLoader } from './AccountLoader';
import { partyEnum } from '../graphql/partyEnum';
import { UserType } from '../user/UserType';
import { users } from '../user/users';

const AccountType = new GraphQLObjectType<IAccount>({
	name: 'Account',
	description: 'Represents a account',
	fields: () => ({
		id: globalIdField('Account'),
		pixKey: {
			type: GraphQLString,
			resolve: (account) => account.pixKey,
		},
    user: {
			type: UserType,
			resolve: (account) => users.find(user => user.id === account.user),
		},
    balance: {
      type: GraphQLString,
      resolve: (account) => account.balance,
    },
    type: {
      type: GraphQLString,
      resolve: (account) => account.type,
    },
    psp: {
      type: GraphQLString,
      resolve: (account) => account.psp,
    },
		createdAt: {
			type: GraphQLString,
			resolve: (account) => account.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

const AccountConnection = connectionDefinitions({
	name: 'Account',
	nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType, AccountConnection };
