const {model, Schema} = require("mongoose");

const userSchema = new Schema(
    {
      name: {
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
  
  
  const userModel = model('User', userSchema);
  module.exports = userModel;
