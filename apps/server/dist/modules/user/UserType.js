"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserConnection = exports.UserType = void 0;
const graphql_1 = require("graphql");
const graphql_relay_1 = require("graphql-relay");
const typeRegister_1 = require("../node/typeRegister");
// import { UserLoader } from './UserLoader';
const fieldMongoId_1 = require("../graphql/fieldMongoId");
const UserType = new graphql_1.GraphQLObjectType({
    name: 'User',
    description: 'Represents a user',
    fields: () => ({
        id: (0, graphql_relay_1.globalIdField)('User'),
        ...(0, fieldMongoId_1.fieldMongoId)(),
        email: {
            type: graphql_1.GraphQLString,
            resolve: (user) => user.email,
        },
        password: {
            type: graphql_1.GraphQLString,
            resolve: (user) => user.password,
        },
        name: {
            type: graphql_1.GraphQLString,
            resolve: (user) => user.name,
        },
        createdAt: {
            type: graphql_1.GraphQLString,
            resolve: (user) => user.createdAt.toISOString(),
        },
    }),
    interfaces: () => [typeRegister_1.nodeInterface],
});
exports.UserType = UserType;
const UserConnection = (0, graphql_relay_1.connectionDefinitions)({
    name: 'User',
    nodeType: UserType,
});
exports.UserConnection = UserConnection;
