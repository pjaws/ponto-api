const { gql } = require('apollo-server-fastify');

const schema = gql`
  type Query {
    me: User
  }

  type User {
    email: String!
  }
`;

export default schema;
