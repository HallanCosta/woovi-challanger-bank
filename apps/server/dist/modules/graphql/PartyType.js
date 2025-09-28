"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyInputType = exports.PartyType = void 0;
const graphql_1 = require("graphql");
const fields = {
    psp: { type: graphql_1.GraphQLString },
    account: { type: graphql_1.GraphQLString },
    type: { type: graphql_1.GraphQLString },
    pixKey: { type: graphql_1.GraphQLString }
};
exports.PartyType = new graphql_1.GraphQLObjectType({
    name: 'Party',
    fields: fields
});
exports.PartyInputType = new graphql_1.GraphQLInputObjectType({
    name: 'PartyInput',
    fields: fields,
});
