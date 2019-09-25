import { gql } from 'apollo-server-fastify';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }
  type User {
    id: ID!
    email: String!
    password: String!
    products: [Product!]
  }
`;
