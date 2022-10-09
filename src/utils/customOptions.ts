import {schemaComposer} from './schemaComposer';
import {composedTypes} from './generateSchema';
import type {ObjectTypeComposerFieldConfigMap} from 'graphql-compose';

const addQueryFields = (
  newFields: ObjectTypeComposerFieldConfigMap<any, any>
) => {
  schemaComposer.Query.addFields(newFields);
  schemaComposer.buildSchema();
};

const addMutationFields = (
  newFields: ObjectTypeComposerFieldConfigMap<any, any>
) => {
  schemaComposer.Mutation.addFields(newFields);
  schemaComposer.buildSchema();
};

const addModelFields = (
  modelName: string,
  newFields: ObjectTypeComposerFieldConfigMap<any, any>
) => {
  composedTypes[modelName].addFields(newFields);
  schemaComposer.buildSchema();
};

export {addModelFields, addQueryFields, addMutationFields};
