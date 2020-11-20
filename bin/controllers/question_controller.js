const Question = require("../models/question");

function createOrUpdate(data, callback) {

  validateQuestion(data, (validData) => {
    // console.log("is valid")  
    if (validData) {

      const query = {},
        update = data,
        options = { upsert: true, new: true, setDefaultsOnInsert: true };


      if (data._id) {
        query._id = data._id;
      }

      console.dir(query, update)
      // Find the document
      Question.findOneAndUpdate(query, update, options, function (error, result) {
        if (error){
          console.log("err: ")
          console.dir(error);
          return callback(500, { "response": "unable to save question. try again later"} );
        }

        console.log("result: ")
        console.dir(result);
        callback(200, {"response": result});
        // do something with the document
      });

    }
    else {
      // data validation failed
      callback(400, {"response": "bad data send, question must at least have a question"});
    }
  });
}


function deleteQuestion(id, callback) {
  if(id) {
    Question.findByIdAndDelete()
  } else {
    // question id not provided 
    callback(400, {"response": "no question id to delete"});
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
}