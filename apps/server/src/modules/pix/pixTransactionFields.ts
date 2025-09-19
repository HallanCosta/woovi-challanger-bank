import { PixTransactionType, PixTransactionConnection } from './PixTransactionType';
// import { PixTransactionLoader } from './PixTransactionLoader';
import { connectionArgs, connectionFromArray } from 'graphql-relay';
import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import { PixTransactionLoader } from './PixTransactionLoader';
import { PixTransaction } from './PixTransactionModel';

export const pixTransactionField = (key: string) => ({
	[key]: {
		type: PixTransactionType,
		resolve: async (obj: Record<string, unknown>, _, context) => PixTransactionLoader.load(context, obj.id as string),
	},
});

const PixTransactionFilters = new GraphQLInputObjectType({
  name: 'PixTransactionFilters', 
  description: 'Filters for the pix transactions',
  fields: () => ({
    user: { type: GraphQLString }
  })
});

export const pixTransactionConnectionField = (key: string) => ({
	[key]: {
		type: PixTransactionConnection.connectionType,
		args: {
			...connectionArgs,
      filters: {
        type: PixTransactionFilters,
      }
		},
		resolve: async (_, args, context) => {
			return await PixTransactionLoader.loadAll(context, args);
		},
	},
});
