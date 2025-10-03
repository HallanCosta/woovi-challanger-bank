import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLazyLoadQuery, fetchQuery } from 'react-relay';
import { LedgerEntryQuery } from './LedgerEntryQuery';
import { LedgerEntryQuery as LedgerEntryQueryType } from '../../__generated__/LedgerEntryQuery.graphql';
import { createEnvironment } from '../../relay/environment';
import { MESSAGES } from '../../constants/messages';

interface UseLedgerEntryQueryOptions {
  filters?: {
    account?: string;
  };
  onRefresh?: () => void;
}

const useLedgerEntryQuery = (options: UseLedgerEntryQueryOptions = {}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const initialData = useLazyLoadQuery<LedgerEntryQueryType>(
    LedgerEntryQuery,
    {
      first: 10,
      after: null,
      filters: options.filters,
    },
    {
      fetchPolicy: 'store-and-network',
      fetchKey: refreshKey,
    }
  );

  useEffect(() => {
    if (initialData?.ledgerEntries) {
      const newTransactions = initialData.ledgerEntries.edges?.map(edge => edge.node) || [];
      const pageInfo = initialData.ledgerEntries.pageInfo;
      
      setAllTransactions(newTransactions);
      setHasNextPage(pageInfo?.hasNextPage);
      setEndCursor(pageInfo?.endCursor);
    }
  }, [initialData]);


  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    
    if (options.onRefresh) {
      options.onRefresh();
    }
    
    setRefreshKey(prev => prev + 1);

    const environment = createEnvironment();
    const result = await fetchQuery(environment, LedgerEntryQuery, {
      first: 10,
      after: null,
      filters: options.filters,
    }).toPromise() as LedgerEntryQueryType['response'];

    if (result?.ledgerEntries) {
      const newTransactions = result.ledgerEntries.edges?.map(edge => edge.node) || [];
      setAllTransactions(newTransactions);
    }

    setIsRefreshing(false);
  }, [options.filters]);

  const loadMore = useCallback(async () => {
    if (hasNextPage && !isLoadingMore && endCursor) {
      setIsLoadingMore(true);
      
      try {
        const environment = createEnvironment();
        const result = await fetchQuery(environment, LedgerEntryQuery, {
          first: 10,
          after: endCursor,
          filters: options.filters || null,
        }).toPromise() as LedgerEntryQueryType['response'];

        if (result?.ledgerEntries) {
          const newTransactions = result.ledgerEntries.edges?.map(edge => edge.node) || [];
          const pageInfo = result.ledgerEntries.pageInfo;
          
          setAllTransactions(prev => [...prev, ...newTransactions]);
          setHasNextPage(pageInfo?.hasNextPage || false);
          setEndCursor(pageInfo?.endCursor || null);
        }
      } catch (error) {
        console.error(MESSAGES.ERROR_NETWORK, error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  }, [hasNextPage, isLoadingMore, endCursor, options.filters]);

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
