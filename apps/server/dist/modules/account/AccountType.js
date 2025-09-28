"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountConnection = exports.AccountType = void 0;
const graphql_1 = require("graphql");
const graphql_relay_1 = require("graphql-relay");
const typeRegister_1 = require("../node/typeRegister");
const typeRegister_2 = require("../node/typeRegister");
const AccountLoader_1 = require("./AccountLoader");
const UserType_1 = require("../user/UserType");
const users_1 = require("../user/users");
const AccountType = new graphql_1.GraphQLObjectType({
    name: 'Account',
    description: 'Represents a account',
    fields: () => ({
        id: (0, graphql_relay_1.globalIdField)('Account'),
        pixKey: {
            type: graphql_1.GraphQLString,
            resolve: (account) => account.pixKey,
        },
        user: {
            type: UserType_1.UserType,
            resolve: (account) => users_1.users.find(user => user.id === account.user),
        },
        balance: {
            type: graphql_1.GraphQLString,
            resolve: (account) => account.balance,
        },
        type: {
            type: graphql_1.GraphQLString,
            resolve: (account) => account.type,
        },
        psp: {
            type: graphql_1.GraphQLString,
            resolve: (account) => account.psp,
        },
        createdAt: {
            type: graphql_1.GraphQLString,
            resolve: (account) => account.createdAt.toISOString(),
        },
    }),
    interfaces: () => [typeRegister_1.nodeInterface],
});
exports.AccountType = AccountType;
const AccountConnection = (0, graphql_relay_1.connectionDefinitions)({
    name: 'Account',
    nodeType: AccountType,
});
exports.AccountConnection = AccountConnection;
// @ts-ignore
(0, typeRegister_2.registerTypeLoader)(AccountType, AccountLoader_1.AccountLoader.load);
