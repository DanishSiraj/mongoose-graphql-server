const express = require('express');
const cors = require('cors');
const http = require('http');
const {ApolloServer} = require('apollo-server-express');
const {
  express: voyagerMiddleware,
} = require('graphql-voyager/middleware/index.js');

const initGraphQLServer = async (schema, port = 5000) => {
  const PORT = port;
  const app = express();

  app.use(cors());

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: schema,
    introspection: true,
    graphiql: true,
    plugins: [],
  });

  await server.start();

  server.applyMiddleware({app, path: '/graphql'});

  httpServer.listen(PORT, () => {
    console.log(`🚀🚀🚀 The server is running at http://localhost:${PORT}/`);
  });

  app.use('/voyager', voyagerMiddleware({endpointUrl: '/graphql'}));
};

module.exports = initGraphQLServer;
