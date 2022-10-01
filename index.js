const mongoose = require('mongoose');
const {composeMongoose} = require('graphql-compose-mongoose');
const {connectDatabases} = require('./utils/connections');
const {addSchemaFields, composer} = require('./utils/schema-composer');
const initGraphqlServer = require('./utils/graphQLServer.js');

connectDatabases().then(async () => {
  const stringModel = require('./models/string.model');
  const userModel = require('./models/user.model');
  const performanceModel = require('./models/performance.model');
  const models = {};
  const composedTypes = {};

  mongoose.connections.map((connection) => {
    Object.keys(connection.models).map((modelName) => {
      models[modelName] = connection.models[modelName];
      const customizationOptions = {};
      composedTypes[modelName] = composeMongoose(
        models[modelName],
        customizationOptions
      );
      addSchemaFields(modelName, composedTypes[modelName]);
    });
  });

  Object.keys(composedTypes).map((composedTypeName) => {
    const model = models[composedTypeName];
    const composedType = composedTypes[composedTypeName];
    Object.keys(model.schema.virtuals).map((virtualName) => {
      const virtual = model.schema.virtuals[virtualName];
      if (virtual?.options?.ref) {
        const refName = virtual.options.ref;
        const localField = virtual.options.localField;
        const foreignField = virtual.options.foreignField;
        const isSingle = virtual.options.justOne;
        // let resolver;
        // if (isSingle) {
          
        // } else {
        // }

        composedTypes[composedTypeName].addRelation(virtualName, {
          resolver: () => composedTypes[refName].mongooseResolvers.findMany(),
          prepareArgs: {
            filter: (source) => ({
              _operators: {
                localField: {in: source[foreignField]},
              },
              limit: isSingle ? 1 : null,
            }),
          },
        });
      }
    });
  });

  const schema = composer.buildSchema();
  await initGraphqlServer(schema);
});
