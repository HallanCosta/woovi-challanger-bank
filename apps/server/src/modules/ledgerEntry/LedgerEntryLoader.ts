import { createLoader } from '@entria/graphql-mongo-helpers';
import { connectionFromArray } from 'graphql-relay';

import { registerLoader } from '../loader/loaderRegister';

import { LedgerEntry } from './LedgerEntryModel';

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
	model: LedgerEntry,
	loaderName: 'LedgerEntryLoader',
});

registerLoader('LedgerEntryLoader', getLoader);

export const LedgerEntryLoader = {
	LedgerEntry: Wrapper,
	getLoader,
	clearCache,
	load,
	loadAll,
};
