import { GraphQLObjectType, GraphQLString, GraphQLFloat } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import type { ConnectionArguments } from 'graphql-relay';

import { ILedgerEntry } from './LedgerEntryModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
import { LedgerEntryLoader } from './LedgerEntryLoader';

const LedgerEntryType = new GraphQLObjectType<ILedgerEntry>({
	name: 'LedgerEntry',
	description: 'Represents a ledger entry',
	fields: () => ({
		id: globalIdField('LedgerEntry'),
    account: {
			type: GraphQLString,
			resolve: (ledgerEntry) => ledgerEntry.account,
		},
    value: {
			type: GraphQLFloat,
			resolve: (ledgerEntry) => ledgerEntry.value,
		},
    type: {
			type: GraphQLString,
			resolve: (ledgerEntry) => ledgerEntry.type,
		},
    description: {
			type: GraphQLString,
			resolve: (ledgerEntry) => ledgerEntry.description,
		},
    pixTransaction: {
			type: GraphQLString,
			resolve: (ledgerEntry) => ledgerEntry.pixTransaction,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (ledgerEntry) => ledgerEntry.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

const LedgerEntryConnection = connectionDefinitions({
	name: 'LedgerEntry',
	nodeType: LedgerEntryType,
});

registerTypeLoader(LedgerEntryType, LedgerEntryLoader.load);

export { LedgerEntryType, LedgerEntryConnection };
