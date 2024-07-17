const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let alertSchema = new Schema(
  {
    chatId: {
      type: String,
    },
    alertMessage: {
      type: String,
    },
    alertDate: {
      type: String,
      required: true,
    },
    alertTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};

module.exports = mongoose.model("alert", alertSchema);
