import { useLazyLoadQuery } from 'react-relay';
import { AccountQuery as AccountQueryType } from '../../__generated__/AccountQuery.graphql';
import { AccountQuery } from './AccountQuery';

const useAccountQuery = () => {
  const data = useLazyLoadQuery<AccountQueryType>(
    AccountQuery,
    { filters: {} },
    { fetchPolicy: 'store-or-network' }
  );

  return data;
};

export { useAccountQuery };
