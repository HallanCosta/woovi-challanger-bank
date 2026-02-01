import { LedgerEntryType, LedgerEntryConnection } from './LedgerEntryType';
import { LedgerEntryLoader } from './LedgerEntryLoader';
import { connectionArgs, connectionFromArray } from 'graphql-relay';
import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import { LedgerEntry } from './LedgerEntryModel';

export const ledgerEntryField = (key: string) => ({
	[key]: {
		type: LedgerEntryType,
		resolve: async (obj: Record<string, unknown>, _, context) =>
			LedgerEntryLoader.load(context, obj.account as string),
	},
});

const LedgerEntryFilters = new GraphQLInputObjectType({
  name: 'LedgerEntryFilters',
  description: 'Filters for the ledger entries',
  fields: () => ({
    account: { type: GraphQLString }
  })
});

export const ledgerEntryConnectionField = (key: string) => ({
	[key]: {
		type: LedgerEntryConnection.connectionType,
		args: {
			...connectionArgs,
      filters: {
        type: LedgerEntryFilters,
      }
		},
		resolve: async (_, args, context) => {
			const { filters } = args;
			const query: any = {};
			
			if (filters?.account) {
				query['ledgerAccount.account'] = filters.account;
			}
			
			if (Object.keys(query).length === 0) {
				return await LedgerEntryLoader.loadAll(context, args);
			}
			
			const documents = await LedgerEntry.find(query).sort({ createdAt: -1 });
			return connectionFromArray(documents, args);
		},
	},
});
