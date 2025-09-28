import { GraphQLObjectType, GraphQLString, GraphQLInt } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';

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
			type: GraphQLInt,
			description: 'The value integer',
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
    idempotencyKey: {
			type: GraphQLString,
			resolve: (ledgerEntry) => ledgerEntry.idempotencyKey,
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

// @ts-ignore
registerTypeLoader(LedgerEntryType, LedgerEntryLoader.load);

export { LedgerEntryType, LedgerEntryConnection };
