import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLFloat } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import type { ConnectionArguments } from 'graphql-relay';

// import { IPixTransaction } from './PixTransactionModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
// import { IPixTransaction } from './PixTransactionModal';
// import { PixTransactionLoader } from './PixTransactionLoader';
import { PartyType } from '../graphql/PartyType';
import { ILedgerEntry } from '../ledgerEntry/LedgerEntryModel';

const PixTransactionType = new GraphQLObjectType<ILedgerEntry>({
	name: 'PixTransaction',
	description: 'Represents a pix transaction',
	fields: () => ({
		id: globalIdField('PixTransaction'),
		value: {
			type: GraphQLFloat,
			resolve: (pixTransaction) => pixTransaction.value,
		},
		status: {
			type: GraphQLString,
			resolve: (pixTransaction) => pixTransaction.status,
		},
		partyDebit: {
			type: PartyType,
			resolve: (pixTransaction) => pixTransaction.ledgerAccount,
		},
		partyCredit: {
			type: PartyType,
			resolve: (pixTransaction) => pixTransaction.ledgerAccount,
		},
		description: {
			type: GraphQLString,
			resolve: (pixTransaction) => pixTransaction.description,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (pixTransaction) => pixTransaction.createdAt.toISOString(),
		},
		updatedAt: {
			type: GraphQLString, 
			resolve: (pixTransaction) => pixTransaction.updatedAt.toISOString(),
		}
	}),
	interfaces: () => [nodeInterface],
});

const PixTransactionConnection = connectionDefinitions({
	name: 'PixTransaction',
	nodeType: PixTransactionType,
});

// registerTypeLoader(PixTransactionType, PixTransactionLoader.load);

export { PixTransactionType, PixTransactionConnection };
