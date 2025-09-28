"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = require("./server/app");
const config_1 = require("./config");
const database_1 = require("./database");
const createGraphqlWs_1 = require("./server/createGraphqlWs");
const getContext_1 = require("./server/getContext");
const schema_1 = require("./schema/schema");
const runBullMq_1 = require("./modules/worker/runBullMq");
(async () => {
    console.log('🚀 SERVIDOR INICIANDO');
    await (0, database_1.connectDatabase)();
    console.log('✅ Database conectado!');
    const server = http_1.default.createServer(app_1.app.callback());
    // wsServer(server);
    (0, createGraphqlWs_1.createGraphqlWs)(server, '/graphql/ws', {
        schema: schema_1.schema,
        context: (0, getContext_1.getContext)(),
    });
    (0, createGraphqlWs_1.createGraphqlWs)(server, '/console/graphql/ws', {
        schema: schema_1.schema,
        context: async () => (0, getContext_1.getContext)(),
    });
    console.log('🔄 Iniciando BullMQ worker...');
    await (0, runBullMq_1.runBullMq)();
    server.listen(config_1.config.PORT, () => {
        // eslint-disable-next-line
        console.log(`Server running on port:${config_1.config.PORT}`);
    });
})();
