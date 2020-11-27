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
  timed: Boolean,
  duration: String,
  expires: Date,
  published: Boolean,
  date_published: Date,
  link: String,
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  }],
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission" 
  }],
  created: Date,
  modified: {
    type: Date,
    default: new Date()
  }
})


// schema.plugin(muv);
module.exports = mongoose.model("Exam", schema);