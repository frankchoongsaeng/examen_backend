const mongoose = require("mongoose");
// const muv = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  examId: {
    type: mongoose.Types.ObjectId,
    ref: "Exam",
    required: true
  },
  category: {
    type: String,
    required: true,
    default: "Uncategorized"
  },
  questionType: {
    type: String,
    default: "subjective",
    required: true
  },
  question: Object,
  question_number: Number
})

// schema.plugin(muv);

module.exports = mongoose.model("Question", schema);