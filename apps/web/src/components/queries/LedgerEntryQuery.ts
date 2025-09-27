import { graphql } from 'react-relay';

const LedgerEntryQuery = graphql`
  query LedgerEntryQuery($first: Int, $after: String, $filters: LedgerEntryFilters) {
    ledgerEntries(first: $first, after: $after, filters: $filters) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
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
