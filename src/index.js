const app = require('fastify')({ logger: true });
const { ApolloServer, gql } = require('apollo-server-fastify');
const typeDefs = require('./schema');

const server = new ApolloServer({ typeDefs });

(async function() {
  app.register(server.createHandler());
  await app.listen(3000);
})();
