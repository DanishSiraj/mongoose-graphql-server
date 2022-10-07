import express, {Application} from 'express';
import cors from 'cors';
import {ApolloServer} from 'apollo-server-express';
import {express as voyagerMiddleware} from 'graphql-voyager/middleware/index.js';
import type {GraphQLSchema} from 'graphql';

const createGraphQLServer = async (
  schema: GraphQLSchema,
  app: Application = express()
) => {
  app.use(cors());

  const server = new ApolloServer({
    schema: schema,
    introspection: true,
    // graphiql: true,
    plugins: [],
  });

  await server.start();

  server.applyMiddleware({app, path: '/graphql'});
  app.use('/voyager', voyagerMiddleware({endpointUrl: '/graphql'}));
  return app;
};

export default createGraphQLServer;
