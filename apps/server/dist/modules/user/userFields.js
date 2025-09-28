"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userConnectionField = exports.userField = void 0;
const UserType_1 = require("./UserType");
// import { UserLoader } from './UserLoader';
const graphql_relay_1 = require("graphql-relay");
const graphql_1 = require("graphql");
const users_1 = require("./users");
const userField = (key) => ({
    [key]: {
        type: UserType_1.UserType,
        resolve: async (obj, _, context) => {
            return users_1.users.find(user => user.email === obj.email) || null;
        },
    },
});
exports.userField = userField;
const UserFilters = new graphql_1.GraphQLInputObjectType({
    name: 'UserFilters',
    description: 'Filters for the users',
    fields: () => ({
        email: { type: graphql_1.GraphQLString }
    })
});
const userConnectionField = (key) => ({
    [key]: {
        type: UserType_1.UserConnection.connectionType,
        args: {
            ...graphql_relay_1.connectionArgs,
            filters: {
                type: UserFilters
            }
        },
        resolve: async (_, args, context) => {
            const getFilteredUsers = (filters = {}) => {
                if (!filters.email)
                    return users_1.users;
                return users_1.users.filter(user => user.email.includes(filters.email));
            };
            const filteredUsers = getFilteredUsers(args.filters);
            return (0, graphql_relay_1.connectionFromArray)(filteredUsers, args);
        },
    },
});
exports.userConnectionField = userConnectionField;
