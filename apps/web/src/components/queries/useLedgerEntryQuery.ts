import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLazyLoadQuery, fetchQuery } from 'react-relay';
import { LedgerEntryQuery } from './LedgerEntryQuery';
import { LedgerEntryQuery as LedgerEntryQueryType } from '../../__generated__/LedgerEntryQuery.graphql';
import { createEnvironment } from '../../relay/environment';

interface UseLedgerEntryQueryOptions {
  filters?: {
    account?: string;
  };
}

const useLedgerEntryQuery = (options: UseLedgerEntryQueryOptions = {}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Query inicial - apenas para primeira carga
  const initialData = useLazyLoadQuery<LedgerEntryQueryType>(
    LedgerEntryQuery,
    {
      first: 10,
      after: null,
      filters: options.filters || null,
    },
    {
      fetchPolicy: 'store-and-network',
      fetchKey: refreshKey, // Apenas para refresh, não para loadMore
    }
  );

  // Atualizar estado quando os dados iniciais mudam
  useEffect(() => {
    if (initialData?.ledgerEntries) {
      const newTransactions = initialData.ledgerEntries.edges?.map(edge => edge.node) || [];
      const pageInfo = initialData.ledgerEntries.pageInfo;
      
      setAllTransactions(newTransactions);
      setHasNextPage(pageInfo?.hasNextPage || false);
      setEndCursor(pageInfo?.endCursor || null);
    }
  }, [initialData]);

  useEffect(() => {
    if (isRefreshing) {
      setIsRefreshing(false);
    }
  }, [initialData, isRefreshing]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
  }, []);

  const loadMore = useCallback(async () => {
    if (hasNextPage && !isLoadingMore && endCursor) {
      setIsLoadingMore(true);
      
      try {
        // Fazer fetch direto sem usar useLazyLoadQuery para evitar re-renderização
        const environment = createEnvironment();
        const result = await fetchQuery(environment, LedgerEntryQuery, {
          first: 10,
          after: endCursor,
          filters: options.filters || null,
        }).toPromise() as LedgerEntryQueryType['response'];

        if (result?.ledgerEntries) {
          const newTransactions = result.ledgerEntries.edges?.map(edge => edge.node) || [];
          const pageInfo = result.ledgerEntries.pageInfo;
          
          // Adicionar novas transações sem re-renderizar tudo
          setAllTransactions(prev => [...prev, ...newTransactions]);
          setHasNextPage(pageInfo?.hasNextPage || false);
          setEndCursor(pageInfo?.endCursor || null);
        }
      } catch (error) {
        console.error('Erro ao carregar mais transações:', error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [hasNextPage, isLoadingMore, endCursor, options.filters]);

  // Criar objeto de dados compatível com o formato esperado
  const paginatedData = useMemo(() => ({
    ledgerEntries: {
      edges: allTransactions.map(transaction => ({ node: transaction })),
      pageInfo: {
        hasNextPage: hasNextPage,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: endCursor,
      }
    }
  }), [allTransactions, hasNextPage, endCursor]);

  return { 
    data: paginatedData, 
    refresh, 
    isRefreshing,
    loadMore,
    hasNext: hasNextPage,
    isLoadingNext: isLoadingMore
  } as const;
};

export { useLedgerEntryQuery };
