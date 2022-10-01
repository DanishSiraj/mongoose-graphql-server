let {schemaComposer} = require('graphql-compose');
const addSchemaFields = (
  name,
  modelTC,
  queryAdditional = {},
  mutationAdditional = {}
) => {
  schemaComposer.Query.addFields({
    [`${name}ById`]: modelTC.mongooseResolvers.findById(),
    [`${name}ByIds`]: modelTC.mongooseResolvers.findByIds(),
    [`${name}One`]: modelTC.mongooseResolvers.findOne(),
    [`${name}Many`]: modelTC.mongooseResolvers.findMany(),
    [`${name}DataLoader`]: modelTC.mongooseResolvers.dataLoader(),
    [`${name}DataLoaderMany`]: modelTC.mongooseResolvers.dataLoaderMany(),
    [`${name}ByIdLean`]: modelTC.mongooseResolvers.findById({lean: true}),
    [`${name}ByIdsLean`]: modelTC.mongooseResolvers.findByIds({lean: true}),
    [`${name}OneLean`]: modelTC.mongooseResolvers.findOne({lean: true}),
    [`${name}ManyLean`]: modelTC.mongooseResolvers.findMany({lean: true}),
    [`${name}DataLoaderLean`]: modelTC.mongooseResolvers.dataLoader({
      lean: true,
    }),
    [`${name}DataLoaderManyLean`]: modelTC.mongooseResolvers.dataLoaderMany({
      lean: true,
    }),
    [`${name}Count`]: modelTC.mongooseResolvers.count(),
    [`${name}Connection`]: modelTC.mongooseResolvers.connection(),
    [`${name}Pagination`]: modelTC.mongooseResolvers.pagination(),
    ...queryAdditional,
  });

  schemaComposer.Mutation.addFields({
    [`${name}CreateOne`]: modelTC.mongooseResolvers.createOne(),
    [`${name}CreateMany`]: modelTC.mongooseResolvers.createMany(),
    [`${name}UpdateById`]: modelTC.mongooseResolvers.updateById(),
    [`${name}UpdateOne`]: modelTC.mongooseResolvers.updateOne(),
    [`${name}UpdateMany`]: modelTC.mongooseResolvers.updateMany(),
    [`${name}RemoveById`]: modelTC.mongooseResolvers.removeById(),
    [`${name}RemoveOne`]: modelTC.mongooseResolvers.removeOne(),
    [`${name}RemoveMany`]: modelTC.mongooseResolvers.removeMany(),
    ...mutationAdditional,
  });
};

const composer = schemaComposer;

module.exports = {composer, addSchemaFields};
