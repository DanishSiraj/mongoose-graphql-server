const {composeMongoose} = require('graphql-compose-mongoose');
const path = require('path');
const {addSchemaFields, composer} = require(path.join(
  __dirname,
  './schema-composer'
));

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
    const schemaFields = Object.keys(model.schema.paths);

    //Populate using refs
    Object.keys(model.schema.tree).map((key) => {
      if (model.schema.tree[key].ref) {
        const refName = model?.schema?.tree[key]?.ref?.modelName;
        const resolverOptions = {
          resolver: () => composedTypes[refName].mongooseResolvers.findOne(),
          prepareArgs: {
            filter: (source) => ({
              _operators: {
                _id: {in: source[[key]]},
              },
            }),
          },
          projection: {[[key]]: true},
        };
        //generate
        composedTypes[composedTypeName].addRelation(key, resolverOptions);
      }

      if (model.schema.tree[key]?.[0]?.ref) {
        const refName = model.schema.tree[key]?.[0]?.ref?.modelName;
        const resolverOptions = {
          resolver: () => composedTypes[refName].mongooseResolvers.findMany(),
          prepareArgs: {
            filter: (source) => ({
              _operators: {
                _id: {in: source[[key]]},
              },
            }),
          },
          projection: {[[key]]: true},
        };
        //generate
        composedTypes[composedTypeName].addRelation(key, resolverOptions);
      }
    });

    //Populate using virutals
    Object.keys(model.schema.virtuals).map((virtualName) => {
      const virtual = model.schema.virtuals[virtualName];
      if (virtual?.options?.ref) {
        const refName = virtual.options.ref;
        const localField = virtual.options.localField;
        const foreignField = virtual.options.foreignField;
        const isSingle = virtual.options.justOne;
        let resolverOptions;

        let searchField =
          !schemaFields.includes(foreignField) &&
          schemaFields.includes(localField)
            ? foreignField
            : schemaFields.includes(foreignField) &&
              !schemaFields.includes(localField)
            ? localField
            : foreignField;

        let searchInField =
          searchField === foreignField ? localField : foreignField;

        //Add Relationships

        if (isSingle) {
          resolverOptions = {
            resolver: () => composedTypes[refName].mongooseResolvers.findOne(),
            prepareArgs: {
              filter: (source) => ({
                _operators: {
                  [[searchField]]: {in: source[[searchInField]]},
                },
                limit: isSingle ? 1 : null,
              }),
            },
            projection: {
              [[searchField]]: true,
            },
          };
        } else {
          resolverOptions = {
            resolver: () => composedTypes[refName].mongooseResolvers.findMany(),
            prepareArgs: {
              filter: (source) => ({
                _operators: {
                  [[searchField]]: {in: source[[searchInField]]},
                },
              }),
            },
            projection: {
              [[searchField]]: true,
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
