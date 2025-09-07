import { useLazyLoadQuery } from 'react-relay';
import { LedgerEntryQuery } from './LedgerEntryQuery';
import { LedgerEntryQuery as LedgerEntryQueryType } from '../../__generated__/LedgerEntryQuery.graphql';

const useLedgerEntryQuery = () => {
  const data = useLazyLoadQuery<LedgerEntryQueryType>(
    LedgerEntryQuery,
    {},
    { fetchPolicy: 'store-or-network' }
  );

  return data;
};

export { useLedgerEntryQuery };
