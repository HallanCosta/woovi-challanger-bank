import { graphql } from 'react-relay';

const LedgerEntryQuery = graphql`
  query LedgerEntryQuery($filters: LedgerEntryFilters) {
    ledgerEntries(filters: $filters) {
      edges {
        node {
          id
          value
          ledgerAccount {
            psp
            account
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
