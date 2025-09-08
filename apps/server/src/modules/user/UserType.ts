import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import type { ConnectionArguments } from 'graphql-relay';

import { IUser } from './UserModel';
import { nodeInterface } from '../node/typeRegister';
import { registerTypeLoader } from '../node/typeRegister';
// import { UserLoader } from './UserLoader';
import { fieldMongoId } from '../graphql/fieldMongoId';

const UserType = new GraphQLObjectType<IUser>({
	name: 'User',
	description: 'Represents a user',
	fields: () => ({
		id: globalIdField('User'),
    ...fieldMongoId(),
		email: {
			type: GraphQLString,
			resolve: (user) => user.email,
		},
		password: {
			type: GraphQLString,
			resolve: (user) => user.password,
		},
		name: {
			type: GraphQLString,
			resolve: (user) => user.name,
		},
		createdAt: {
			type: GraphQLString,
			resolve: (user) => user.createdAt.toISOString(),
		},
	}),
	interfaces: () => [nodeInterface],
});

const UserConnection = connectionDefinitions({
	name: 'User',
	nodeType: UserType,
});

// registerTypeLoader(UserType, UserLoader.load);

export { UserType, UserConnection };
