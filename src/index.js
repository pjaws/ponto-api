import 'dotenv/config';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import { ApolloServer, AuthenticationError } from 'apollo-server-fastify';
import jwt from 'jsonwebtoken';
import typeDefs from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const fastify = require('fastify')({ logger: true });

fastify.register(cors);
fastify.register(helmet);

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError(
        'Your session expired. Please sign in again.'
      );
    }
  }

  return null;
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const me = await getMe(req);
    return {
      models,
      me,
      secret: process.env.SECRET,
    };
  },
});

async function serve() {
  fastify.register(server.createHandler());
  await fastify.listen(3000);
}

const eraseDatabaseOnSync = true;

const createUsersWithProducts = async () => {
  await models.User.create(
    {
      email: 'paulmattjaws@gmail.com',
      password: 'granolabar',
      role: 'ADMIN',
      products: [
        {
          title: 'Granola Bar',
          sku: 'GB-001',
        },
      ],
    },
    {
      include: [models.Product],
    }
  );
  await models.User.create(
    {
      email: 'fakeuser@example.com',
      password: 'hotdogs',
      role: 'USER',
      products: [
        {
          title: 'Rubber Hot Dog',
          sku: 'RHD-001',
        },
      ],
    },
    {
      include: [models.Product],
    }
  );
};

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithProducts();
  }

  serve();
});
