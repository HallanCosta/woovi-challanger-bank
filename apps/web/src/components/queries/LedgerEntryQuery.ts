import { graphql } from 'react-relay';

const LedgerEntryQuery = graphql`
  query LedgerEntryQuery {
    ledgerEntries {
      edges {
        node {
          id
          value
          ledgerAccount {
            psp
            account
            name
            document
            type
            pixKey
          }
          type
          description
          pixTransaction
          createdAt
        }
      }
    }
  }
`;

export { LedgerEntryQuery };
