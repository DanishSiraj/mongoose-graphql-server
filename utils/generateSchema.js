const {composeMongoose} = require('graphql-compose-mongoose');
const {addSchemaFields, composer} = require('./schema-composer');

const generateSchema = (mongoose) => {
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
        let resolverOptions;
        if (isSingle) {
          resolverOptions = {
            resolver: () => composedTypes[refName].mongooseResolvers.findOne(),
            prepareArgs: {
              filter: (source) => ({
                _operators: {
                  localField: {in: source[foreignField]},
                },
                limit: isSingle ? 1 : null,
              }),
            },
          };
        } else {
          resolverOptions = {
            resolver: () => composedTypes[refName].mongooseResolvers.findMany(),
            prepareArgs: {
              filter: (source) => ({
                _operators: {
                  localField: {in: source[foreignField]},
                },
                limit: isSingle ? 1 : null,
              }),
            },
          };
        }

        composedTypes[composedTypeName].addRelation(
          virtualName,
          resolverOptions
        );
      }
    });
  });

  const schema = composer.buildSchema();
  return schema;
};

module.exports = generateSchema;
