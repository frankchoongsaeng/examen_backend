const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  examId: {
    type: mongoose.Types.ObjectId,
    ref: "Exam"
  },
  started: Date,
  submitted: Boolean,
  date_submitted: Date,
  responses: [{
    type: Object
  }],
  score: Number
})


module.exports = mongoose.model("Submission", schema);