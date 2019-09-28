import { gql } from 'apollo-server-fastify';

export default gql`
  extend type Query {
    products(cursor: String, limit: Int): ProductConnection!
    product(id: ID!): Product!
  }

  extend type Mutation {
    createProduct(title: String!): Product!
    deleteProduct(id: ID!): Boolean!
  }

  type ProductConnection {
    edges: [Product!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    hasNextPage: Boolean!
    endCursor: String!
  }

  type Product {
    id: ID!
    title: String!
    sku: String!
    user: User!
    createdAt: Date
    updatedAt: Date
    description: String
    price: Float
    shopifyId: Int
    tags: [String]
    type: String
    vendor: String
  }
`;
