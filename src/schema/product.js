import { gql } from 'apollo-server-fastify';

export default gql`
  extend type Query {
    products: [Product!]!
    product(id: ID!): Product!
  }

  extend type Mutation {
    createProduct(title: String!): Product!
    deleteProduct(id: ID!): Boolean!
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
`;
