import { createLoader } from '@entria/graphql-mongo-helpers';

import { registerLoader } from '../loader/loaderRegister';

import { PixTransaction } from './PixTransactionModel';

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
	model: PixTransaction,
	loaderName: 'PixTransactionLoader',
});

registerLoader('PixTransactionLoader', getLoader);

export const PixTransactionLoader = {
	PixTransaction: Wrapper,
	getLoader,
	clearCache,
	load,
	loadAll,
};
