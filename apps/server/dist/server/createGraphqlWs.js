"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGraphqlWs = void 0;
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const schema_1 = require("../schema/schema");
const graphql_1 = require("graphql");
const url_1 = require("url");
const createGraphqlWs = (server, path, options) => {
    const wss = new ws_1.Server({
        noServer: true,
    });
    (0, ws_2.useServer)({
        schema: options.schema,
        execute: graphql_1.execute,
        subscribe: graphql_1.subscribe,
        context: async () => {
            if (typeof options.context === 'function') {
                return options.context();
            }
            return options.context;
        },
        onConnect: () => {
            //eslint-disable-next-line
            console.log(`Connected to ${path} Websocket`);
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
    // @ts-ignore
    server.on('upgrade', function upgrade(request, socket, head) {
        // @ts-ignore
        const { pathname } = (0, url_1.parse)(request.url);
        if (pathname === path) {
            wss.handleUpgrade(request, socket, head, function done(ws) {
                wss.emit('connection', ws, request);
            });
        }
    });
};
exports.createGraphqlWs = createGraphqlWs;
