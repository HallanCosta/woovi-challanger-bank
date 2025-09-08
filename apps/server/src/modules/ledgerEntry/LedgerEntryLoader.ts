import { createLoader } from '@entria/graphql-mongo-helpers';
import { connectionFromArray } from 'graphql-relay';

import { registerLoader } from '../loader/loaderRegister';

import { LedgerEntry } from './LedgerEntryModel';

const { Wrapper, getLoader, clearCache, load, loadAll: baseLoadAll } = createLoader({
	model: LedgerEntry,
	loaderName: 'LedgerEntryLoader',
});

// Implementação customizada do loadAll com suporte a filtros
const loadAll = async (context: any, args: any) => {
	const { filters } = args;
	
	// Construir query de filtro
	let query: any = {};
	
	if (filters?.account) {
		// Filtrar por conta usando o campo ledgerAccount.account
		query['ledgerAccount.account'] = filters.account;
	}
	
	// Buscar documentos com filtro (sem .lean() para manter os documentos Mongoose)
	const documents = await LedgerEntry.find(query)
		.sort({ createdAt: -1 }); // Ordenar por data de criação (mais recentes primeiro)
	
	// Usar connectionFromArray para paginação
	return connectionFromArray(documents, args);
};

registerLoader('LedgerEntryLoader', getLoader);

export const LedgerEntryLoader = {
	LedgerEntry: Wrapper,
	getLoader,
	clearCache,
	load,
	loadAll,
};
