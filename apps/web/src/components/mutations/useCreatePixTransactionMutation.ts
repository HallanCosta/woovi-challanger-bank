import { useMutation } from 'react-relay';
import { CreatePixTransactionMutation } from '../../__generated__/CreatePixTransactionMutation.graphql';
import { CreatePixTransaction } from './CreatePixTransactionMutation';

const useCreatePixTransactionMutation = () => {
  const [commit, isInFlight] = useMutation<CreatePixTransactionMutation>(CreatePixTransaction);

  const createPixTransaction = (
    input: {
    value: number;
    status: string;
    debitParty: {
      account: string;
      name: string;
      psp: string;
      type: string;
      pixKey: string;
    };
    creditParty: {
      account: string;
      name: string;
      psp: string;
      type: string;
      pixKey: string;
    };
    description?: string;
    idempotencyKey: string;
  },
    handlers?: {
      onCompleted?: (response: any) => void;
      onError?: (error: Error) => void;
    }
  ) => {
    return commit({
      variables: { input },
      onCompleted: (response) => {
        handlers?.onCompleted?.(response);
      },
      onError: (error) => {
        handlers?.onError?.(error as any);
      },
    });
  };

  return {
    createPixTransaction,
    isInFlight,
  };
};

export { useCreatePixTransactionMutation };
