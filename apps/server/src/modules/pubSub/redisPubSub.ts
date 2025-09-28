import { RedisPubSub } from 'graphql-redis-subscriptions';

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
		} as any;
	}
	
	return new RedisPubSub({
		connection: process.env.REDIS_HOST,
	});
};

// Função para fechar conexões (útil para testes)
export const closeRedisPubSub = async () => {
	if (redisPubSub) {
		await redisPubSub.close();
	}
};

export const redisPubSub = createRedisPubSub();
