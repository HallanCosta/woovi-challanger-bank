"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisPubSub = exports.closeRedisPubSub = void 0;
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
// Criar uma instância condicional baseada no ambiente
const createRedisPubSub = () => {
    // Em ambiente de teste, não inicializar Redis se não houver configuração
    if (process.env.NODE_ENV === 'test' && !process.env.REDIS_HOST) {
        // Mock do RedisPubSub para testes
        return {
            publish: async () => Promise.resolve(),
            subscribe: () => ({
                [Symbol.asyncIterator]: async function* () {
                    // Mock iterator vazio
                }
            }),
            close: async () => Promise.resolve(),
        };
    }
    return new graphql_redis_subscriptions_1.RedisPubSub({
        connection: process.env.REDIS_HOST,
    });
};
// Função para fechar conexões (útil para testes)
const closeRedisPubSub = async () => {
    if (exports.redisPubSub) {
        await exports.redisPubSub.close();
    }
};
exports.closeRedisPubSub = closeRedisPubSub;
exports.redisPubSub = createRedisPubSub();
