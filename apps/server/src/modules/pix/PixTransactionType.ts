import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLFloat, GraphQLInt } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';

import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { PartyType } from '../graphql/PartyType';
import { PixTransactionLoader } from './PixTransactionLoader';
import { IPixTransaction } from './PixTransactionModel';

const PixTransactionType = new GraphQLObjectType<IPixTransaction>({
	name: 'PixTransaction',
	description: 'Represents a pix transaction',
	fields: () => ({
		id: globalIdField('PixTransaction'),
		value: {
			type: GraphQLInt,
			description: 'The value integer',
			resolve: (pixTransaction) => pixTransaction.value,
		},
		status: {
			type: GraphQLString,
			resolve: (pixTransaction) => pixTransaction.status,
		},
		debitParty: {
			type: PartyType,
			resolve: (pixTransaction) => pixTransaction.debitParty,
		},
		creditParty: {
			type: PartyType,
			resolve: (pixTransaction) => pixTransaction.creditParty,
		},
		description: {
			type: GraphQLString,
			resolve: (pixTransaction) => pixTransaction.description,
		},
    idempotencyKey: {
			type: GraphQLString,
			resolve: (pixTransaction) => pixTransaction.idempotencyKey,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (pixTransaction) => pixTransaction.createdAt.toISOString(),
		},
		updatedAt: {
			type: GraphQLString, 
			resolve: (pixTransaction) => pixTransaction.updatedAt.toISOString(),
		},
  }),
	interfaces: () => [nodeInterface],
});

const PixTransactionConnection = connectionDefinitions({
	name: 'PixTransaction',
	nodeType: PixTransactionType,
});

// @ts-ignore
registerTypeLoader(PixTransactionType, PixTransactionLoader.load);

export { PixTransactionType, PixTransactionConnection };
