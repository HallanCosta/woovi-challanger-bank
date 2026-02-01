import { UserType, UserConnection } from './UserType';
// import { UserLoader } from './UserLoader';
import { connectionArgs, connectionFromArray } from 'graphql-relay';
import { GraphQLInputObjectType, GraphQLString } from 'graphql';
import { users } from './users';

export const userField = (key: string) => ({
	[key]: {
		type: UserType,
		resolve: async (obj: Record<string, unknown>, _, context) => {
      return users.find(user => user.email === obj.email) || null;
    },
	},
});

const UserFilters = new GraphQLInputObjectType({
  name: 'UserFilters',
  description: 'Filters for the users',
  fields: () => ({
    email: { type: GraphQLString }
  })
});

export const userConnectionField = (key: string) => ({
	[key]: {
		type: UserConnection.connectionType,
		args: {
			...connectionArgs,
      filters: {
        type: UserFilters
      } 
		},
		resolve: async (_, args, context) => {
      const getFilteredUsers = (filters: any = {}) => {
        if (!filters.email) return users;

        return users.filter(user => user.email.includes(filters.email)); 
      }

      const filteredUsers = getFilteredUsers(args.filters);
      return connectionFromArray(filteredUsers, args);
		},
	},
});
