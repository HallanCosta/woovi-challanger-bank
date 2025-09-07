import { useLazyLoadQuery } from 'react-relay';
import { LoginQuery as LoginQueryType } from '../../__generated__/LoginQuery.graphql';
import { LoginQuery } from './LoginQuery';

const useLoginQuery = () => {
  const data = useLazyLoadQuery<LoginQueryType>(
    LoginQuery,
    { filters: {} },
    { fetchPolicy: 'store-or-network' }
  );

  return data;
};

export { useLoginQuery };
