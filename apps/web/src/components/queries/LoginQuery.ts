import { graphql } from 'react-relay';

// Dados de usuários mockados, senha vem para "autenticar"
const LoginQuery = graphql`
  query LoginQuery($filters: UserFilters) {
    users(filters: $filters) {
      edges {
        node {
          id
          email
          password
        }
      }
    }
  }
`;

export { LoginQuery };
