const mongoose = require('mongoose');
const {composeMongoose} = require('graphql-compose-mongoose');
const {connectDatabases} = require('./utils/connections');
const {addSchemaFields, composer} = require('./utils/schema-composer');
const initGraphqlServer = require('./utils/graphQLServer.js');

connectDatabases().then(async () => {
  const stringModel = require('./models/string.model');
  const userModel = require('./models/user.model');
  const performanceModel = require('./models/performance.model');
  const composedTypes = {};

  mongoose.connections.map((connection) => {
    Object.keys(connection.models).map((modelName) => {
      let model = connection.models[modelName];
      const customizationOptions = {};
      composedTypes[modelName] = composeMongoose(model, customizationOptions);
      addSchemaFields(modelName, composedTypes[modelName]);
    });
  });

  const schema = composer.buildSchema();
  await initGraphqlServer(schema);
});
