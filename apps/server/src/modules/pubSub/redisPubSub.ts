import { RedisPubSub } from 'graphql-redis-subscriptions';
import { createMockRedisPubSub } from '../../__tests__/setup/fixtures/mockRedisPubSub';

// Instância global do RedisPubSub (lazy loading)
let _redisPubSub: any = null;

// Função para obter a instância do RedisPubSub
const getRedisPubSub = () => {
	if (_redisPubSub) {
		return _redisPubSub;
	}

	// Em ambiente de teste ou quando REDIS_HOST não está definido, usar mock
	if (process.env.NODE_ENV === 'test' || !process.env.REDIS_HOST) {
		_redisPubSub = createMockRedisPubSub();
		return _redisPubSub;
	}

	try {
		_redisPubSub = new RedisPubSub({
			connection: process.env.REDIS_HOST,
		});
	} catch (error) {
		// Se falhar ao criar RedisPubSub, usar mock
		console.warn('Falha ao conectar com Redis, usando mock:', error);
		_redisPubSub = createMockRedisPubSub();
	}

	return _redisPubSub;
};

// Função para fechar conexões (útil para testes)
export const closeRedisPubSub = async () => {
	if (_redisPubSub && typeof _redisPubSub.close === 'function') {
		await _redisPubSub.close();
		_redisPubSub = null;
	}
};

// Exportar a instância usando getter para lazy loading
export const redisPubSub = new Proxy({} as any, {
	get(target, prop) {
		const instance = getRedisPubSub();
		return instance[prop];
	}
});
