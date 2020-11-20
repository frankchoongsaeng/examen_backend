const mongoose = require("mongoose");
// const muv = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  for: {
    type: mongoose.Types.ObjectId,
    ref: "Organization"
  },
  timed: {
    type: Boolean
  },
  duration: String,
  expires: Date,
  published: Boolean,
  link: String
})

// schema.plugin(muv);

module.exports = mongoose.model("Exam", schema);