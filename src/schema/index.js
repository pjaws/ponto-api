import { gql } from 'apollo-server-fastify';

const schema = gql`
  type Query {
    users: [User!]
    user(id: ID!): User
    me: User

    products: [Product!]!
    product(id: ID!): Product!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    products: [Product!]
  }

  type Product {
    id: ID!
    title: String!
    user: User!
    description: String
    shopifyId: Int
    tags: [String]
    type: String
    vendor: String
  }

  type Mutation {
    login(email: String): String # login token
    createProduct(title: String!): Product!
    deleteProduct(id: ID!) Boolean!
  }
`;

export default schema;
