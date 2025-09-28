"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const QueryType_1 = require("./QueryType");
const MutationType_1 = require("./MutationType");
// import { SubscriptionType } from './SubscriptionType';
exports.schema = new graphql_1.GraphQLSchema({
    query: QueryType_1.QueryType,
    mutation: MutationType_1.MutationType,
    // subscription: SubscriptionType,
});
