"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldString = void 0;
const graphql_1 = require("graphql");
const fieldString = (key) => ({
    [key]: {
        type: graphql_1.GraphQLString,
        resolve: (obj) => obj[key],
    },
});
exports.fieldString = fieldString;
