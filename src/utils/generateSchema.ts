import {composeMongoose} from 'graphql-compose-mongoose';
import {addSchemaFields, schemaComposer} from './schemaComposer';
import type {Connection, Mongoose} from 'mongoose';
import type {ObjectTypeComposerWithMongooseResolvers} from 'graphql-compose-mongoose';

const models: {
  [key: string]: any;
} = {};

const composedTypes: {
  [key: string]: ObjectTypeComposerWithMongooseResolvers<any, any>;
} = {};

const generateSchema = (mongoose: Mongoose) => {
  mongoose.connections.map((connection: Connection) => {
    Object.keys(connection.models).map((modelName: string) => {
      models[modelName] = connection.models[modelName];
      const customizationOptions = {};
      composedTypes[modelName] = composeMongoose(
        models[modelName],
        customizationOptions
      );
      addSchemaFields(modelName, composedTypes[modelName]);
    });
  });

  Object.keys(composedTypes).map((composedTypeName: string) => {
    const model = models[composedTypeName];
    // const composedType = composedTypes[composedTypeName];
    const schemaFields = Object.keys(model.schema.paths);

    //Populate using refs
    Object.keys(model.schema.tree).map((key: string) => {
      if (model.schema.tree[key].ref) {
        const refName =
          typeof model.schema.tree[key].ref === 'string'
            ? model?.schema?.tree[key]?.ref
            : model.schema.tree[key].ref?.modelName;

        if (!Object.keys(composedTypes).includes(refName)) {
          throw new Error('Invalid Ref');
        }

        const resolverOptions = {
          resolver: () => composedTypes[refName].mongooseResolvers.findOne(),
          prepareArgs: {
            filter: (source: any) => ({
              _operators: {
                _id: {in: source[key]},
              },
            }),
          },
          projection: {[key]: true},
        };
        //generate
        composedTypes[composedTypeName].addRelation(key, resolverOptions);
      }

      if (model.schema.tree[key]?.[0]?.ref) {
        const refName =
          typeof model.schema.tree[key]?.[0]?.ref === 'string'
            ? model.schema.tree[key]?.[0]?.ref
            : model.schema.tree[key]?.[0]?.ref?.modelName;

        if (!Object.keys(composedTypes).includes(refName)) {
          throw new Error('Invalid Ref');
        }

        const resolverOptions = {
          resolver: () => composedTypes[refName].mongooseResolvers.findMany(),
          prepareArgs: {
            filter: (source: any) => ({
              _operators: {
                _id: {in: source[key]},
              },
            }),
          },
          projection: {[key]: true},
        };
        //generate
        composedTypes[composedTypeName].addRelation(key, resolverOptions);
      }
    });

    //Populate using virutals
    Object.keys(model.schema.virtuals).map((virtualName: string) => {
      const virtual = model.schema.virtuals[virtualName];
      if (virtual?.options?.ref) {
        const refName = virtual.options.ref;
        const localField = virtual.options.localField;
        const foreignField = virtual.options.foreignField;
        const isSingle = virtual.options.justOne;
        let resolverOptions;

        let searchField: string =
          !schemaFields.includes(foreignField) &&
          schemaFields.includes(localField)
            ? foreignField
            : schemaFields.includes(foreignField) &&
              !schemaFields.includes(localField)
            ? localField
            : foreignField;

        let searchInField: string =
          searchField === foreignField ? localField : foreignField;

        //Add Relationships

        if (isSingle) {
          resolverOptions = {
            resolver: () => composedTypes[refName].mongooseResolvers.findOne(),
            prepareArgs: {
              filter: (source: any) => ({
                _operators: {
                  [searchField]: {in: source[searchInField]},
                },
                limit: isSingle ? 1 : null,
              }),
            },
            projection: {
              [searchField]: true,
            },
          };
        } else {
          resolverOptions = {
            resolver: () => composedTypes[refName].mongooseResolvers.findMany(),
            prepareArgs: {
              filter: (source: any) => ({
                _operators: {
                  [searchField]: {in: source[searchInField]},
                },
              }),
            },
            projection: {
              [searchField]: true,
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

  const schema = schemaComposer.buildSchema();
  return schema;
};

export {generateSchema, composedTypes};
