"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAddMutation = void 0;
const graphql_1 = require("graphql");
const graphql_relay_1 = require("graphql-relay");
const redisPubSub_1 = require("../../pubSub/redisPubSub");
const pubSubEvents_1 = require("../../pubSub/pubSubEvents");
const AccountModel_1 = require("../AccountModel");
const accountFields_1 = require("../accountFields");
const partyEnum_1 = require("../../graphql/partyEnum");
const mutation = (0, graphql_relay_1.mutationWithClientMutationId)({
    name: 'AccountAdd',
    inputFields: {
        content: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
        },
    },
    mutateAndGetPayload: async (args) => {
        const account = await new AccountModel_1.Account({
            pixKey: args.pixKey,
            user: args.user,
            balance: args.balance,
            type: args.type || partyEnum_1.partyEnum.PHYSICAL,
        }).save();
        redisPubSub_1.redisPubSub.publish(pubSubEvents_1.PUB_SUB_EVENTS.ACCOUNT.ADDED, {
            account: account._id.toString(),
        });
        return {
            account: account._id.toString(),
        };
    },
    outputFields: {
        ...(0, accountFields_1.accountField)('account'),
    },
});
exports.AccountAddMutation = {
    ...mutation,
};
