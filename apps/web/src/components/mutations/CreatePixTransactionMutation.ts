import { graphql } from 'react-relay';

const CreatePixTransaction = graphql`
  mutation CreatePixTransactionMutation(
    $input: CreatePixTransactionInput!
  ) {
    CreatePixTransaction(input: $input) {
      pixTransaction {
        id
        value
        status
        description
        createdAt
        debitParty {
          psp
          account
          type
          pixKey
        }
        creditParty {
          psp
          account
          type
          pixKey
        }
      }
    }
  }
`;

export { CreatePixTransaction };
