const {model, Schema} = require("mongoose");

const stringPerformanceSchema = new Schema(
    {
      timestamp: Date,
      average_current: Number,
      average_voltage: Number,
      temperature: Number,
      average_irradiance: Number,
      power: Number,
      converted_power: Number,
      string_id: String,
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
  
  stringPerformanceSchema.virtual('test', {
    ref: 'Test',
    foreignField: '_id',
    localField: 'string_id',
    justOne: true,
  });
  
  const performanceModel = model(
    'StringPerformance',
    stringPerformanceSchema
  );

  module.exports = performanceModel;