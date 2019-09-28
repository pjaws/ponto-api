import { ForbiddenError } from 'apollo-server-fastify';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isProductOwner } from './authorization';

export default {
  Query: {
    products: async (_, __, { models, me }) =>
      models.Product.findAll({
        where: {
          userId: me.id,
        },
      }),
    product: async (_, { id }, { models }) => models.Product.findByPk(id),
  },
  Mutation: {
    createProduct: combineResolvers(
      isAuthenticated,
      async (_, product, { me, models }) => {
        if (!me) throw new ForbiddenError('Not authenticated.');

        return models.Product.create({
          ...product,
          userId: me.id,
        });
      }
    ),
    deleteProduct: combineResolvers(
      isAuthenticated,
      isProductOwner,
      async (_, { id }, { models }) => models.Product.destroy({ where: { id } })
    ),
  },
  Product: {
    user: async (product, __, { models }) =>
      models.User.findByPk(product.userId),
  },
};
