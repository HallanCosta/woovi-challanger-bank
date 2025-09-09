import { graphql } from 'react-relay';

const CreatePixTransaction = graphql`
  mutation CreatePixTransactionMutation(
    $input: CreatePixTransactionInput!
  ) {
    CreatePixTransaction(input: $input) {
      pixTransaction {
        value
        status
        description
        message
      }
    }
  }
`;

export { CreatePixTransaction };
