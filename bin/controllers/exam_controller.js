const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Exam = require("../models/exam");
const Question = require("../models/question");
const { isString, isMaxLen, isMinLen } = require("../utils/checkers");
const { generateUniqueLink } = require("../utils/helpers");

function getAllExams(token, callback) {

  if (token) {


    // decode token and get userId from it
    jwt.verify(token, process.env.SECRET, (err, decoded) => {

      if (decoded) {

        // get the userId from the decoded token
        let userId = decoded.id;

        // find all exams of the user
        // User.findById(userId, (err, userDoc) => {

        //   if (err) {
        //     return callback(500, { "response": "error finding user, this is a problem on our end and we're working to fix it" })
        //   }

        //   if (userDoc) {

        //     // find all exams in the 

        //   }
        //   else {
        //     return callback(404, { "response": "This error should not occur, but it seems you've provided a token for a user that does not exist. Please report this error to the dev team" })
        //   }


        // });
        Exam.find({ 'ownerId': userId }, (err, allexams) => {

          if (err) {
            return callback(500, { "response": "error finding exams, this is a problem on our end and we're working to fix it" })
          }

          if (allexams) {
            return callback(200, allexams);
          }
          else {
            return callback(204, { "response": "error finding exams" })
          }
        });


      }
      else {
        return callback(403, { "response": "unable to verify token." })
      }
    });
  }
  else {
    callback(400, { "response": "missing token, could not authenticate user" });
  }
}


function createNewExam(data, callback) {

  // continue only if a valid token was provided
  let { token } = data;
  jwt.verify(token, process.env.SECRET, (err, decoded) => {

    if (decoded) {

      // valid token was provided
      // validate the provided data
      validateExamDetail(data, false, validatedData => {
        if (validatedData) {

          // validation was successfull
          let _new_exam_doc = new Exam({
            ownerId: decoded.id,
            title: validatedData.title,
            created: new Date()
          });

          // save the new exam in the database
          _new_exam_doc.save((err) => {

            if (!err) {

              // save operation was successfull
              // user successfully updated with exam
              callback(201, { "response": _new_exam_doc });
            }
            else {
              // save operation failed
              console.trace(err);
              callback(500, { "response": "unable to save exam, this is a problem on our end and we're working to fix it" });
            }
          });
        }
        else {
          // validation failed
          callback(400, { "response": "missing required field(s)" });
        }
      });
    }
    else {
      // invalid token
      callback(403, { "response": "invalid token, please login to continue" });
    }

  });


}


/**
 * provided an exam id and user token, returns
 * an exam that matches the provided id
 * @param {object} data 
 * @param {function} callback 
 */
function getExamById(data, callback) {

  /**@todo add verification of token */
  if (data.token && data.id) {

    // query the exam from the database
    Exam.findById(data.id, (err, document) => {

      // if the search was unsuccessfull
      if (err) {
        return callback(500, { "response": "could not query database. This is problem on our end and our deb team is working hard to fix this" });
      }

      //  if the search was successfull
      if (document) {
        return callback(200, document);
      }

      callback(404, { "response": "no exam with that id was found" });
    });

  }
  else {
    // requester did not provide a token
    callback(400, { "response": "missing token or exam id" });
  }

}


function addQuestionToExam(data, callback) {

  /** @todo add token verification */
  if (data.token) {
    const { examId, questionList } = data;

    Exam.updateOne({ _id: examId }, {
      $set: {
        questions: questionList,
        modified: new Date()
      }
    }, (err, examdocument) => {
      if (!err) {
        callback(200, examdocument);
      }
      else {
        console.trace(err);
        callback(500, { "response": "unable to save question to exam" });
      }
    })

  }
  else {
    callback(400, { "response": "missing or invalid token" })
  }
}


function publishExam(id, data, callback) {

  validateExamDetail(data, true, validatedData => {

    if (validatedData) {

      let published = true,
        expires = validatedData.expires,
        timed = validatedData.isTimed,
        date_published = new Date(),
        link = generateUniqueLink(validatedData.title);


      Exam.findByIdAndUpdate(id, { $set: { published, date_published, expires, timed, link } }, { new: true }, (err, newlyUpdated) => {
        if (err) {
          console.trace(err);
          return callback(500, { "response": "unable to publish exam" });
        }

        callback(200, newlyUpdated);
      });
    }
    else {
      console.trace(validatedData);
      callback(400, { "response": "missing required fields" })
    }

  });

}


function getExamByLink(link, callback) {

  Exam.findOne({link: link}, (err, examdocument) => {
    if(err) {
      console.trace(err);
      return callback(500, {"response": "unable to search for exam"});
    }

    callback(200, examdocument);
  })
}



function deleteExamById(data, callback) {

  /**@todo add token verification */
  if (data.id && data.token) {

    // delete the exam
    Exam.findByIdAndDelete(data.id, (err, document) => {

      // if an error occurred during deletion
      if (err) {
        return callback(500, { "response": "could not delete the exam. this is a problem on our end and our dev team is working hard to fix this" });
      }

      // delete questions related to that exam 
      Question.deleteMany({ examId: document._id || '' }, err => {

        // if an error occurred during deletion
        if (err) {
          return callback(500, { "response": "could not delete the exam. this is a problem on our end and our dev team is working hard to fix this" });
        }

        // if the delete was successfull 
        callback(200, { "response": `the exam with id ${data.id} has been deleted successfully` });
      });
    })
  }
  else {
    callback(400, { "response": "missing token or exam id" });
  }
}


function getPublishedExams(userId, callback) {

  Exam.find({ ownerId: userId, published: true }, (err, examdocuments) => {
    // could not successfully find the exam
    if (err) {
      console.trace(err);
      return callback(500, { "response": "unable to complete database query" });
    }

    // query successfull
    callback(200, examdocuments);
  });

}


function getDraftExams(userId, callback) {

  Exam.find({ ownerId: userId, published: false || undefined }, (err, examdocuments) => {
    // could not successfully find the exam
    if (err) {
      console.trace(err);
      return callback(500, { "response": "unable to complete database query" });
    }

    // query successfull
    callback(200, examdocuments);
  });

}


function editCreatedExam() {
}



/**
 * =================================
 * ==== HELPER FUNCTIONS DOWN  HERE
 * ==================================
**/

const validateExamDetail = (data, isNew, callback) => {

  const title = isString(data.title) && isMinLen(data.title, 5) ? data.title : false;
  // const timed = data.timed;
  // const _timed = typeof timed == "boolean" ? true : false; // validator for boolean
  // const expires = isDate(expires);

  // it required data is absent, callback false
  if (!title) {
    return callback(false);
  }

  // callback an object containing formatted data to be stored
  // if data passed validation 
  callback({ title });
}

module.exports = {
  getAllExams,
  createNewExam,
  editCreatedExam,
  addQuestionToExam,
  getExamById,
  deleteExamById,
  publishExam,
  getPublishedExams,
  getDraftExams,
  getExamByLink,
}