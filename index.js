const path = require('path');
const generateSchema = require(path.join(
  __dirname,
  './utils/generateSchema.js'
));
const createGraphQLServer = require(path.join(
  __dirname,
  './utils/graphQLServer.js'
));

module.exports = {
  generateSchema,
  createGraphQLServer,
};
