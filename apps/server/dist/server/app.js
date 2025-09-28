"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const kcors_1 = __importDefault(require("kcors"));
const koa_graphql_1 = require("koa-graphql");
const koa_router_1 = __importDefault(require("koa-router"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const schema_1 = require("../schema/schema");
const getContext_1 = require("./getContext");
const websocketMiddleware_1 = require("./websocketMiddleware");
const app = new koa_1.default();
exports.app = app;
app.use((0, kcors_1.default)({ origin: '*' }));
app.use((0, koa_logger_1.default)());
app.use((0, koa_bodyparser_1.default)({
    onerror(err, ctx) {
        ctx.throw(err, 422);
    },
}));
app.use((0, websocketMiddleware_1.createWebsocketMiddleware)());
const routes = new koa_router_1.default();
// routes.all('/graphql/ws', wsServer);
routes.all('/graphql', (0, koa_graphql_1.graphqlHTTP)(() => ({
    schema: schema_1.schema,
    graphiql: true,
    context: (0, getContext_1.getContext)(),
})));
app.use(routes.routes());
app.use(routes.allowedMethods());
