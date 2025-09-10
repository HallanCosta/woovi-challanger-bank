import { useEffect, useMemo, useState } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { LedgerEntryQuery } from './LedgerEntryQuery';
import { LedgerEntryQuery as LedgerEntryQueryType } from '../../__generated__/LedgerEntryQuery.graphql';

interface UseLedgerEntryQueryOptions {
  filters?: {
    account?: string;
  };
}

const useLedgerEntryQuery = (options: UseLedgerEntryQueryOptions = {}) => {
  const [fetchKey, setFetchKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const queryOptions = useMemo(() => ({
    fetchPolicy: 'store-and-network',
    fetchKey,
  }) as const, [fetchKey]);

  const data = useLazyLoadQuery<LedgerEntryQueryType>(
    LedgerEntryQuery,
    {
      filters: options.filters || null,
    },
    queryOptions
  );

  useEffect(() => {
    if (isRefreshing) {
      setIsRefreshing(false);
    }
  }, [data, isRefreshing]);

  const refresh = () => {
    setIsRefreshing(true);
    setFetchKey((prev) => prev + 1);
  };

  return { data, refresh, isRefreshing } as const;
};

export { useLedgerEntryQuery };
