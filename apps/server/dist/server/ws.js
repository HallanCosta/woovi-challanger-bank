"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ws = void 0;
const graphql_1 = require("graphql");
const ws_1 = require("graphql-ws/lib/use/ws");
const schema_1 = require("../schema/schema");
const getContext_1 = require("./getContext");
const ws = async (ctx) => {
    if (ctx.wss) {
        // handle upgrade
        const client = await ctx.ws();
        (0, ws_1.useServer)({
            schema: schema_1.schema,
            context: async (wsContext) => (0, getContext_1.getContext)(),
            execute: graphql_1.execute,
            subscribe: graphql_1.subscribe,
            // @ts-ignore
            onConnect: async (wsContext) => { },
            // @ts-ignore
            onSubscribe: async (wsContext, message) => {
                const { operationName, query, variables } = message.payload;
                const document = typeof query === 'string' ? (0, graphql_1.parse)(query) : query;
                const args = {
                    schema: schema_1.schema,
                    contextValue: {},
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
            // onNext: async ({ connectionParams }) => {
            //   const token = getTokenFromConnectionParams(connectionParams);
            //   if (!(await isTokenValid(token))) {
            //     return ctx.extra.socket.close(4403, 'Forbidden');
            //   }
            // },
            // onError: (ctx, msg, errors) => {
            //   console.error('Error', { ctx, msg, errors });
            // },
            // onComplete: (ctx, msg) => {
            //   console.log('Complete', { ctx, msg });
            // },
        }, ctx.wss);
        // connect to websocket
        ctx.wss.emit('connection', client, ctx.req);
    }
};
exports.ws = ws;
