import { AccountType, AccountConnection } from './AccountType';
import { AccountLoader } from './AccountLoader';
import { connectionArgs } from 'graphql-relay';
import { GraphQLInputObjectType, GraphQLString } from 'graphql';

export const accountField = (key: string) => ({
	[key]: {
		type: AccountType,
		resolve: async (obj: Record<string, unknown>, _, context) =>
			AccountLoader.load(context, obj.account as string),
	},
});

const AccountFilters = new GraphQLInputObjectType({
  name: 'AccountFilters',
  description: 'Filters for the accounts',
  fields: () => ({
    user: { type: GraphQLString }
  })
});

export const accountConnectionField = (key: string) => ({
	[key]: {
		type: AccountConnection.connectionType,
		args: {
			...connectionArgs,
      filters: {
        type: AccountFilters,
      }
		},
		resolve: async (_, args, context) => {
			return await AccountLoader.loadAll(context, args);
		},
	},
});
