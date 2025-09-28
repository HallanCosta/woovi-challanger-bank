import { GraphQLObjectType } from 'graphql';

import { accountMutations } from '../modules/account/mutations/accountMutations';
import { pixTransactionMutations } from '../modules/pix/mutations/pixTransactionMutations';

export const MutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: () => ({
		...accountMutations,
		...pixTransactionMutations,
	}),
});
