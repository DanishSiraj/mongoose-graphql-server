const {model, Schema} = require("mongoose");
const {connections} = require("../utils/connections.js");

const stringSchema = new Schema(
    {
      name: {
        type: String,
      },
  
      inverter_id: {
        type: String,
      },
  
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
      toObject: {
        virtuals: true,
      },
      toJSON: {
        virtuals: true,
      },
    }
  );
  
  
  stringSchema.virtual('performances', {
    ref: 'StringPerformance',
    foreignField: 'string_id',
    localField: '_id',
    justOne: false,
  });
  
  const stringModel = connections?.test2.model('Test', stringSchema);
  module.exports = stringModel;