const mongoose = require('mongoose');
const {connectDatabases} = require('./utils/connections');
const generateSchema = require('./utils/generateSchema.js');
const initGraphqlServer = require('./utils/graphQLServer.js');

connectDatabases().then(async () => {
  const stringModel = require('./models/string.model');
  const userModel = require('./models/user.model');
  const performanceModel = require('./models/performance.model');

  const schema = generateSchema(mongoose);
  await initGraphqlServer(schema, 3000);
});
