const mongoose = require("mongoose");
const muv = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  for: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
})

// schema.plugin(muv);

module.exports = mongoose.model("Token", schema);