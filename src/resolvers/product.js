import { combineResolvers } from 'graphql-resolvers';
import Sequelize from 'sequelize';
import { isAuthenticated, isProductOwner } from './authorization';
import pubsub, { EVENTS } from '../subscriptions';

const toCursorHash = string => Buffer.from(string).toString('base64');
const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    products: async (_, { cursor, limit = 100 }, { models, me }) => {
      const cursorOpts = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
              userId: me.id,
            },
          }
        : { where: { userId: me.id } };

      const products = await models.Product.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOpts,
      });

      const hasNextPage = products.length > limit;
      const edges = hasNextPage ? products.slice(0, -1) : products;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString()),
        },
      };
    },
    product: combineResolvers(
      isAuthenticated,
      isProductOwner,
      async (_, { id }, { models }) => models.Product.findByPk(id)
    ),
  },
  Mutation: {
    createProduct: combineResolvers(
      isAuthenticated,
      async (_, args, { me, models }) => {
        const product = await models.Product.create({
          ...args,
          userId: me.id,
        });

        pubsub.publish(EVENTS.PRODUCT.CREATED, {
          productCreated: { product },
        });

        return product;
      }
    ),
    updateProduct: combineResolvers(
      isAuthenticated,
      isProductOwner,
      async (_, { id, ...updates }, { models }) => {
        const product = await models.Product.findByPk(id);

        await product.update(updates);

        pubsub.publish(EVENTS.PRODUCT.UPDATED, {
          productUpdated: { product },
        });

        return product;
      }
    ),
    deleteProduct: combineResolvers(
      isAuthenticated,
      isProductOwner,
      async (_, { id }, { models }) => models.Product.destroy({ where: { id } })
    ),
  },
  Subscription: {
    productCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.PRODUCT.CREATED),
    },
    productUpdated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.PRODUCT.UPDATED),
    },
  },
  Product: {
    user: async (product, __, { loaders }) => loaders.user.load(product.userId),
  },
};
