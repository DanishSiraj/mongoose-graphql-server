const express = require('express');
const cors = require('cors');
const {ApolloServer} = require('apollo-server-express');
const {
  express: voyagerMiddleware,
} = require('graphql-voyager/middleware/index.js');

const createGraphQLServer = async (schema) => {
  const app = express();

  app.use(cors());

  const server = new ApolloServer({
    schema: schema,
    introspection: true,
    graphiql: true,
    plugins: [],
  });

  await server.start();

  server.applyMiddleware({app, path: '/graphql'});
  app.use('/voyager', voyagerMiddleware({endpointUrl: '/graphql'}));
  return app;
};

module.exports = createGraphQLServer;
