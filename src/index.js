import 'dotenv/config';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import { ApolloServer } from 'apollo-server-fastify';
import typeDefs from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const fastify = require('fastify')({ logger: true });

fastify.register(cors);
fastify.register(helmet);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin('paulmattjaws@gmail.com'),
    secret: process.env.SECRET,
  }),
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
