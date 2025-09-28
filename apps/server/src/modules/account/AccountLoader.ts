import { createLoader } from '@entria/graphql-mongo-helpers';

import { registerLoader } from '../loader/loaderRegister';

import { Account } from './AccountModel';
import { connectionFromArray } from 'graphql-relay';

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
	model: Account,
	loaderName: 'AccountLoader',
});

registerLoader('AccountLoader', getLoader);

export const AccountLoader = {
	Account: Wrapper,
	getLoader,
	clearCache,
	load,
	loadAll,
};
