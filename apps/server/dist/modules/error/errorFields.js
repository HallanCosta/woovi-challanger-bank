"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorField = void 0;
const graphql_1 = require("graphql");
const errorField = (key) => ({
    [key]: {
        type: graphql_1.GraphQLString,
        resolve: async (obj) => obj.error,
    },
});
exports.errorField = errorField;
