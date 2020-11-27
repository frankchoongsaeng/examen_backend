const Question = require("../models/question");

function createOrUpdate(data, callback) {

  validateQuestion(data, (validData) => {

    if (validData) {

      // save a mongodb docuement if it's a new question
      if (!validData._id) {
        delete validData._id; // remove the id to avoid overwriting

        let new_question = new Question(validData)

        // create a document because it has not yet been created
        new_question.save((error, result) => {
          if (error) {
            console.trace("err: ")
            console.dir(error);
            return callback(500, { "response": "unable to save question. try again later" });
          }

          callback(200, result);
        });

      }
      else {
        // update a document becuase it has already been created
        let query = { _id: validData._id };
        delete validData._id;
        let update = { ...validData };
        let options = { upsert: true, new: true, setDefaultsOnInsert: true };

        // Find the document
        Question.findOneAndUpdate(query, update, options, (error, result) => {
          if (error) {
            console.trace(error);
            return callback(500, { "response": "unable to save question. try again later" });
          }

          callback(200, { "response": result });
        });
      }
    }
    else {
      // data validation failed
      callback(400, { "response": "bad data send, question must at least have a question" });
    }
  });
}


function deleteQuestion(id, callback) {
  if (id) {
    Question.findByIdAndDelete(id, err => {
      if (err) {
        console.trace(err);
        return callback(500, {"response": "unable to delete question"})
      }

      callback(200, {"response": "operation successfull"});
    })
  } else {
    // question id not provided 
    callback(400, { "response": "no question id to delete" });
  }
}


function getQuestion(id, callback) {
  if (id) {
    Question.findById(id, (err, questionData) => {
      if (err) {
        console.trace(err);
        return callback(500, {"response": "unable to delete question"})
      }

      callback(200, questionData);
    });
  }
  else {
    // question id was not provided
    callback(400, { "response": "no question id to get" });
  }
}


/**
 * @todo validate quetsion data to be updated in database
 */
const validateQuestion = (data, callback) => {
  return callback(data);
}


module.exports = {
  createOrUpdate,
  deleteQuestion,
  getQuestion,
}