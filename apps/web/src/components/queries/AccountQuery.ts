import { graphql } from 'react-relay';

const AccountQuery = graphql`
  query AccountQuery($filters: AccountFilters) {
    accounts(filters: $filters) {
      edges {
        node {
          id
          balance
          pixKey
          user {
            id
            email
            name
            createdAt
          }
          type
        }
      }
    }
  }
`;

export { AccountQuery };
