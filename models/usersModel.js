const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    chatId: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};

module.exports = mongoose.model("user", userSchema);
