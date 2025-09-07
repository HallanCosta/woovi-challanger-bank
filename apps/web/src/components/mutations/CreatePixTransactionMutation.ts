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
          name
          document
          type
          pixKey
        }
        creditParty {
          psp
          account
          name
          document
          type
          pixKey
        }
      }
    }
  }
`;

export { CreatePixTransaction };
