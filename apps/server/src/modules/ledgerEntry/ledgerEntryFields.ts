import { LedgerEntryType, LedgerEntryConnection } from './LedgerEntryType';
import { LedgerEntryLoader } from './LedgerEntryLoader';
import { connectionArgs } from 'graphql-relay';

export const ledgerEntryField = (key: string) => ({
	[key]: {
		type: LedgerEntryType,
		resolve: async (obj: Record<string, unknown>, _, context) =>
			LedgerEntryLoader.load(context, obj.account as string),
	},
});

export const ledgerEntryConnectionField = (key: string) => ({
	[key]: {
		type: LedgerEntryConnection.connectionType,
		args: {
			...connectionArgs,
		},
		resolve: async (_, args, context) => {
			return await LedgerEntryLoader.loadAll(context, args);
		},
	},
});
