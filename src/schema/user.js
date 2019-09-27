import { gql } from 'apollo-server-fastify';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    register(email: String!, password: String!): Token!
    login(email: String!, password: String!): Token!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    email: String!
    products: [Product!]
  }
`;
