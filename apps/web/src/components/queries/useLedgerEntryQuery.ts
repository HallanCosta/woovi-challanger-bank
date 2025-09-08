import { useLazyLoadQuery } from 'react-relay';
import { LedgerEntryQuery } from './LedgerEntryQuery';
import { LedgerEntryQuery as LedgerEntryQueryType } from '../../__generated__/LedgerEntryQuery.graphql';

interface UseLedgerEntryQueryOptions {
  filters?: {
    account?: string;
  };
}

const useLedgerEntryQuery = (options: UseLedgerEntryQueryOptions = {}) => {
  const data = useLazyLoadQuery<LedgerEntryQueryType>(
    LedgerEntryQuery,
    {
      filters: options.filters || null,
    },
    { fetchPolicy: 'store-or-network' }
  );

  return data;
};

export { useLedgerEntryQuery };
