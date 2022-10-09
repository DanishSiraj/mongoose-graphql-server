import express, {Application, Router} from 'express';
import {ApolloServer, Config, ExpressContext} from 'apollo-server-express';
import {GraphQLSchema} from 'graphql';

const createGraphQLServer = async (
  config: GraphQLSchema | Config<ExpressContext>,
  app: Application = express()
) => {
  let configuration: any =
    config instanceof GraphQLSchema
      ? {
          schema: config,
          introspection: true,
          plugins: [],
        }
      : config;

  const server = new ApolloServer(configuration);

  await server.start();

  server.applyMiddleware({app, path: '/graphql'});
  return app;
};

const createGraphQLMiddleware = async (
  config: GraphQLSchema | Config<ExpressContext>
) => {
  const router: Router = Router();

  let configuration: any =
    config instanceof GraphQLSchema
      ? {
          schema: config,
          introspection: true,
          plugins: [],
        }
      : config;

  const server = new ApolloServer(configuration);

  await server.start();

  server.applyMiddleware({
    app: router as express.Application,
    path: '/graphql',
  });

  return router;
};

export {createGraphQLServer, createGraphQLMiddleware};
