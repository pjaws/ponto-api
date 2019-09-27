import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';

const TOKEN_EXPIRATION = '1d';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return jwt.sign({ id, email, username }, secret, { expiresIn });
};

export default {
  Query: {
    users: async (parent, args, { models }) => models.User.findAll(),
    user: async (parent, { id }, { models }) => models.User.findByPk(id),
    me: async (parent, args, { models, me }) => {
      if (!me) return null;

      return models.User.findByPk(me.id);
    },
  },
  Mutation: {
    register: async (parent, { email, password }, { models, secret }) => {
      const user = await models.User.create({
        email,
        password,
      });

      return { token: createToken(user, secret, TOKEN_EXPIRATION) };
    },
    login: async (parent, { email, password }, { models, secret }) => {
      const user = await models.User.findByEmail(email);

      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, TOKEN_EXPIRATION) };
    },
  },
  User: {
    products: async (user, args, { models }) =>
      models.Product.findAll({
        where: {
          userId: user.id,
        },
      }),
  },
};
