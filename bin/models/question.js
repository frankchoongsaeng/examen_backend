const mongoose = require("mongoose");


const schema = new mongoose.Schema({
  examId: {
    type: mongoose.Types.ObjectId,
    ref: "Exam",
    required: true
  },
  category: {
    type: String,
    required: true,
    default: "uncategorized"
  },
  questionType: {
    type: String,
    default: "subjective",
    required: true
  },
  question: String
});


module.exports = mongoose.model("Question", schema);