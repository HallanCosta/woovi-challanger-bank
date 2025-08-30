import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import { redisPubSub } from '../../pubSub/redisPubSub';
import { PUB_SUB_EVENTS } from '../../pubSub/pubSubEvents';

import { User } from '../UserModel';
import { userField } from '../userFields';

export type UserAddInput = {
	email: string;
};

const mutation = mutationWithClientMutationId({
	name: 'UserAdd',
	inputFields: {
		content: {
			type: new GraphQLNonNull(GraphQLString),
		},
	},
	mutateAndGetPayload: async (args: UserAddInput) => {
		const user = await new User({
			email: args.email,
		}).save();

		redisPubSub.publish(PUB_SUB_EVENTS.USER.ADDED, {
			user: user._id.toString(),
		});

		return {
			user: user._id.toString(),
		};
	},
	outputFields: {
		...userField('user'),
	},
});

export const UserAddMutation = {
	...mutation,
};
