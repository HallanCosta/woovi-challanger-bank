// Mock do RedisPubSub para testes
export const createMockRedisPubSub = () => ({
	publish: async () => Promise.resolve(),
	subscribe: () => ({
		[Symbol.asyncIterator]: async function* () {
			// Mock iterator vazio
		}
	}),
	close: async () => Promise.resolve(),
});
