"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldMongoId = void 0;
const graphql_1 = require("graphql");
const fieldMongoId = () => ({
    _id: {
        type: graphql_1.GraphQLString,
        resolve: (obj) => obj._id,
    },
});
exports.fieldMongoId = fieldMongoId;
