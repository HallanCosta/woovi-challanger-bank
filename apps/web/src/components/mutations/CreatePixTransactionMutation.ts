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
        debitParty {
          psp
          account
          type
          pixKey
          name
        }
        creditParty {
          psp
          account
          type
          pixKey
          name
        }
        idempotencyKey
      }
    }
  }
`;

export { CreatePixTransaction };
