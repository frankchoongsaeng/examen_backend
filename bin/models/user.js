const mongoose = require("mongoose");
const muv = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
  },
  position: String,
  exams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exam" 
  }],
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Submission" 
  }],
  tokens: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Token" 
  }],
  currentToken: { 
    type:  mongoose.Schema.Types.ObjectId,
    ref: "Token"
  }
})

schema.plugin(muv);

module.exports = mongoose.model("User", schema);