import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

import { Account } from '../AccountModel';
import { accountField } from '../accountFields';
import { partyEnum } from '../../graphql/partyEnum';

export type AccountAddInput = {
	pixKey: string;
	user: string;
	balance: number;
	type?: partyEnum.LEGAL | partyEnum.PHYSICAL;
};

const mutation = mutationWithClientMutationId({
	name: 'AccountAdd',
	inputFields: {
		content: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async (args: AccountAddInput) => {
		const account = await new Account({
			pixKey: args.pixKey,
      user: args.user,
      balance: args.balance,
      type: args.type || partyEnum.PHYSICAL,
		}).save();

		redisPubSub.publish(PUB_SUB_EVENTS.ACCOUNT.ADDED, {
			account: account._id.toString(),
		});

		return {
			account: account._id.toString(),
		};
	},
	outputFields: {
		...accountField('account'),
	},
});

export const AccountAddMutation = {
	...mutation,
};
