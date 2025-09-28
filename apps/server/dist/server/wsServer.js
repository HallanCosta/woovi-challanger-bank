"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsServer = void 0;
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const schema_1 = require("../schema/schema");
const graphql_1 = require("graphql");
const getContext_1 = require("./getContext");
const wsServer = (server) => {
    const wss = new ws_1.Server({
        server,
        path: '/graphql/ws',
    });
    (0, ws_2.useServer)({
        schema: schema_1.schema,
        execute: graphql_1.execute,
        subscribe: graphql_1.subscribe,
        context: async () => (0, getContext_1.getContext)(),
        onConnect: () => {
            //eslint-disable-next-line
            console.log('Connected to Websocket');
            return;
        },
        onSubscribe: async (_, message) => {
            const { operationName, query, variables } = message.payload;
            const document = typeof query === 'string' ? (0, graphql_1.parse)(query) : query;
            const args = {
                schema: schema_1.schema,
                operationName,
                document,
                variableValues: variables,
            };
            const validationErrors = (0, graphql_1.validate)(args.schema, args.document);
            if (validationErrors.length > 0) {
                return validationErrors; // return `GraphQLError[]` to send `ErrorMessage` and stop Subscription
            }
            return args;
        },
    }, wss);
};
exports.wsServer = wsServer;
