import 'dotenv/config';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';
import { ApolloServer } from 'apollo-server-fastify';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

const fastify = require('fastify')({ logger: true });

fastify.register(cors);
fastify.register(helmet);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { models, me: models.users[1] },
});

async function serve() {
  fastify.register(server.createHandler());
  await fastify.listen(3000);
}

serve();
