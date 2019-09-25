import { gql } from 'apollo-server-fastify';
import userSchema from './user';
import productSchema from './product';

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, productSchema];
