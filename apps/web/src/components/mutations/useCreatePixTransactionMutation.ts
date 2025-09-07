import { useMutation } from 'react-relay';
import { CreatePixTransactionMutation } from '../../__generated__/CreatePixTransactionMutation.graphql';
import { CreatePixTransaction } from './CreatePixTransactionMutation';

const useCreatePixTransactionMutation = () => {
  const [commit, isInFlight] = useMutation<CreatePixTransactionMutation>(CreatePixTransaction);

  const createPixTransaction = (input: {
    value: number;
    status: string;
    debitParty: {
      account: string;
    };
    creditParty: {
      account: string;
    };
    description?: string;
  }) => {
    return commit({
      variables: { input },
      onCompleted: (response) => {
        console.log('PIX Transaction created:', response);
      },
      onError: (error) => {
        console.error('Error creating PIX transaction:', error);
      },
    });
  };

  return {
    createPixTransaction,
    isInFlight,
  };
};

export { useCreatePixTransactionMutation };
