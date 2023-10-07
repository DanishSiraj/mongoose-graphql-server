import express, {Application, Router} from 'express';
import {
  ApolloServer,
  ApolloServerOptionsWithStaticSchema,
} from '@apollo/server';
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import {GraphQLSchema} from 'graphql';
import http from 'http';
import cors from 'cors';
import {json} from 'body-parser';

const createGraphQLServer = async (
  config:
    | GraphQLSchema
    | ApolloServerOptionsWithStaticSchema<ExpressContextFunctionArgument>,
  app: Application = express()
) => {
  const httpServer = http.createServer(app);

  let configuration: any =
    config instanceof GraphQLSchema
      ? {
          schema: config,
          introspection: true,
          plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
        }
      : config;

  const server = new ApolloServer(configuration);
  await server.start();

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({req}) => ({token: req.headers.token}),
    })
  );

  // await new Promise<void>((resolve) =>
  //   httpServer.listen({port: 4000}, resolve)
  // );

  // console.log(`🚀 Server ready at http://localhost:4000/graphql`);
  return app;
};

const createGraphQLMiddleware = async (
  config:
    | GraphQLSchema
    | ApolloServerOptionsWithStaticSchema<ExpressContextFunctionArgument>
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

  router.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({req}) => ({token: req.headers.token}),
    })
  );
  // server.applyMiddleware({
  //   app: router as express.Application,
  //   path: '/graphql',
  // });

  return router;
};

export {createGraphQLServer, createGraphQLMiddleware};
