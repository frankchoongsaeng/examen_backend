const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Exam = require("../models/exam");
const {isString, isMaxLen, isMinLen} = require("../utils/checkers");

function getAllExams(token, callback) {
  // console.log(token)

  if (token) {


    // decode token and get userId from it
    jwt.verify(token, process.env.SECRET, (err, decoded) => {

      // console.log(err, decoded);

      if (decoded) {

        // get the userId from the decoded token
        let userId = decoded.id;

        // find all exams of the user
        User.findById(userId, (err, userDoc) => {  

          if (err) {
            return callback(500, { "response": "error finding user, this is a problem on our end and we're working to fix it" })
          }

          if (userDoc) {

            // find all exams in the 
            Exam.find({
              '_id': { $in: userDoc.exams }
            }, (err, allexams) => {
              
              if(err) {
                return callback(500, { "response": "error finding exams, this is a problem on our end and we're working to fix it" })
              }

              if(allexams) {
                return callback(200, allexams );
              }
              else {
                return callback(204, { "response": "could not find exams in user's record" })
              }
            });

          }
          else {
            return callback(404, { "response": "This error should not occur, but it seems you've provided a token for a user that does not exist. Please report this error to the dev team" })
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
    
    if(decoded) {
      // valid token was provided

      // validate the provided data
      validateExamDetail(data, false, validatedData => {
        if(validatedData){
    
          // validation was successfull
          let _new_exam_doc = new Exam({
            ownerId: decoded.id,
            title: validatedData.title
          });

          // save the new exam in the database
          _new_exam_doc.save((err, newly_created_exam) => {

            if(!err) {
              // save operation was successfull

              // save the exam to the user
              User.updateOne(
                { _id: decoded.id }, 
                { $push: { exams: newly_created_exam.id } },
                (err) => {
                  
                  if(!err) {
                    
                    // user successfully updated with exam
                    callback(201, {"response": _new_exam_doc});
                  }
                  else {
                    // unable to update user although exam has been saved.
                    // this could cause issues when trying to clean up
                    // after a user has been deleted
                    console.trace(err);
                    callback(500, { "response": "unable to update use with exam, but the exam was successfully created" });
                  }
                }
              )
            }
            else {
              // save operation failed
              console.trace(err);
              callback(500, {"response": "unable to save exam, this is a problem on our end and we're working to fix it"});
            }

          })
    
        }
        else {
    
          // validation failed
          callback(400, {"response": "missing required field(s)"});
        }
      });

    }
    else {
      // invalid token
      callback(403, {"response": "invalid token, please login to continue"});
    }

  });

  
}



function editCreatedExam()  {
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
  if(!title) {
    return callback(false);
  }

  // callback an object containing formatted data to be stored
  // if data passed validation 
  callback({title: title});
}

module.exports = {
  getAllExams,
  createNewExam,
  editCreatedExam
}