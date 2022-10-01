const mongoose = require('mongoose');
const {connectDatabases} = require('./utils/connections');
const generateSchema = require('./utils/generateSchema.js');
const createGraphQLServer = require('./utils/graphQLServer.js');
const PORT = process.env.port || 3000;

connectDatabases().then(async () => {
  const stringModel = require('./models/string.model');
  const userModel = require('./models/user.model');
  const performanceModel = require('./models/performance.model');

  const schema = generateSchema(mongoose);
  const app = await createGraphQLServer(schema);

  app.listen(PORT, () => {
    console.log(`🚀🚀🚀 The server is running at http://localhost:${PORT}/`);
  });
});
