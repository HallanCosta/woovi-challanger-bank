import { graphql } from 'react-relay';

const LoginQuery = graphql`
  query LoginQuery($filters: UserFilters) {
    users(filters: $filters) {
      edges {
        node {
          id
          email
          password
          name
        }
      }
    }
  }
`;

export { LoginQuery };
