import { PixTransactionType, PixTransactionConnection } from './PixTransactionType';
// import { PixTransactionLoader } from './PixTransactionLoader';
import { connectionArgs } from 'graphql-relay';
import { GraphQLInputObjectType, GraphQLString } from 'graphql';

export const pixTransactionField = (key: string) => ({
	[key]: {
		type: PixTransactionType,
		resolve: async (obj: Record<string, unknown>, _, context) => {
      return null;
    }
    // PixTransactionLoader.load(context, obj.pixTransaction as string),
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
      console.dir(args, { depth: null })
      return [];
			// return await PixTransactionLoader.loadAll(context, args);
		},
	},
});
