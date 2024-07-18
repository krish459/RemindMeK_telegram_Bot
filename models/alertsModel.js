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
    alertDateTime: {
      type: Date,
      required: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};

module.exports = mongoose.model("alert", alertSchema);
