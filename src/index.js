import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import typeDefs from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';
import loaders from './loaders';

const app = express();

app.use(cors());
app.use(helmet());

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
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
        },
      };
    }

    const me = await getMe(req);
    return {
      models,
      me,
      secret: process.env.SECRET,
      loaders: {
        user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
      },
    };
  },
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const createUsersWithProducts = async () => {
  await models.User.create(
    {
      id: '04c24519-51d9-4197-9579-d536d38d2887',
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
      id: 'CC16DF49-7FCD-461C-BA8F-B9F3064FDD78',
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

const isTest = !!process.env.TEST_DATABASE;
const isProduction = !!process.env.DATABASE_URL;

sequelize.sync({ force: isTest || isProduction }).then(async () => {
  if (isTest || isProduction) {
    createUsersWithProducts();
  }

  httpServer.listen({ port: process.env.PORT }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`
    );
  });
});
