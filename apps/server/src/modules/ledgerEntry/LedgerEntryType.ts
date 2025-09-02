import { GraphQLObjectType, GraphQLString, GraphQLFloat, GraphQLNonNull } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import type { ConnectionArguments } from 'graphql-relay';

import { ILedgerEntry } from './LedgerEntryModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
import { LedgerEntryLoader } from './LedgerEntryLoader';

import { PartyType } from '../graphql/PartyType';

const LedgerEntryType = new GraphQLObjectType<ILedgerEntry>({
	name: 'LedgerEntry',
	description: 'Represents a ledger entry',
	fields: () => ({
		id: globalIdField('LedgerEntry'),
    value: {
			type: GraphQLFloat,
			resolve: (ledgerEntry) => ledgerEntry.value,
		},
    type: {
			type: GraphQLString,
			resolve: (ledgerEntry) => ledgerEntry.type,
		},
    status: {
			type: GraphQLString,
			resolve: (ledgerEntry) => ledgerEntry.status,
		},
    ledgerAccount: {
			type: PartyType,
			resolve: (ledgerEntry) => ledgerEntry.ledgerAccount,
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
