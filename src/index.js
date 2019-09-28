import 'dotenv/config';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import jwt from 'jsonwebtoken';
import typeDefs from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

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
      return { models };
    }

    const me = await getMe(req);
    return {
      models,
      me,
      secret: process.env.SECRET,
    };
  },
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

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

  httpServer.listen({ port: process.env.PORT }, () => {
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`
    );
  });
});
