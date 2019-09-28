import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server-fastify';
import { isAdmin } from './authorization';

const TOKEN_EXPIRATION = '1d';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, role } = user;
  return jwt.sign({ id, email, role }, secret, { expiresIn });
};

export default {
  Query: {
    users: async (_, __, { models }) => models.User.findAll(),
    user: async (_, { id }, { models }) => models.User.findByPk(id),
    me: async (_, __, { models, me }) => {
      if (!me) return null;

      return models.User.findByPk(me.id);
    },
  },
  Mutation: {
    register: async (_, { email, password }, { models, secret }) => {
      const user = await models.User.create({
        email,
        password,
      });

      return { token: createToken(user, secret, TOKEN_EXPIRATION) };
    },
    login: async (_, { email, password }, { models, secret }) => {
      const user = await models.User.findByEmail(email);

      if (!user) {
        throw new UserInputError('No user found with these credentials.');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, TOKEN_EXPIRATION) };
    },
    deleteUser: combineResolvers(isAdmin, async (_, { id }, { models }) => {
      return models.User.destroy({ where: { id } });
    }),
  },
  User: {
    products: async (user, __, { models }) =>
      models.Product.findAll({
        where: {
          userId: user.id,
        },
      }),
  },
};
