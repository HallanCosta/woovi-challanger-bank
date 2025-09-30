import { GraphQLObjectType } from 'graphql';

import { pixTransactionMutations } from '../modules/pix/mutations/pixTransactionMutations';

export const MutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		...pixTransactionMutations,
	}),
});
