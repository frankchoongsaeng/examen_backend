const Submission = require("../models/submission");
const Exam = require("../models/exam");


function getSubmission(userEmail, callback) {

  if (userEmail) {
    Submission.findOne({ email: userEmail }, (err, userSubmission) => {

      if (err) {
        console.trace(err);
        return callback(500, { "response": "could not lookup that email from the db." });
      }

      callback(200, userSubmission);
    })
  }
  else {
    callback(400, { "response": "invalid user email provided" });
  }
}


/**@todo validate the submission data */
function saveSubmission(submissiondata, callback) {

  if (submissiondata) {

    console.dir({ submissiondata });

    let subdata = new Submission(submissiondata);

    console.dir({ subdata });

    subdata.save((err, savedSubmissionData) => {

      if (err) {
        console.trace(err);
        return callback(500, { "response": "could not save submission data to the db." });
      }

      callback(201, savedSubmissionData);
    })
  }
  else {
    callback(400, { "response": "no submission data was provided" });
  }
}


function saveResponseList(id, list, callback) {

  let updateQuery = {
    $set: {
      responses: list
    }
  }



  Submission.findByIdAndUpdate(id, updateQuery, { new: true }, (err, submissiondata) => {
    if (err) {
      console.trace(err);
      return callback(500, { "response": "unable to update submission. Please try again later" });
    }

    callback(200, submissiondata);
  });
}


function finishSubmission(id, data, callback) {

  // let updateQuery = {
  //   $set: {
  //     submitted: true,
  //     date_submitted: new Date()
  //   }
  // }

  // const query =  {
  //   $pull: { 
  //     picturesGallery:  {
  //       _id: {
  //         $in: req.body
  //       }
  //     } 
  //   } 
  // }


  Submission.findByIdAndUpdate(id, updateQuery, { new: true }, (err, submissiondata) => {
    if (err) {
      console.trace(err);
      return callback(500, { "response": "unable to update submission. Please try again later" });
    }

    Exam.findByIdAndUpdate(data.examId, { $push: { submissions: data._id}}, (err) => {

      if(err) {
        console.trace(err);
        callback(500, {"response": "could not query thee database finalise the submission."});
      }

      callback(200, submissiondata);
    });

  });
}


module.exports = {
  getSubmission,
  saveSubmission,
  saveResponseList,
  finishSubmission,
}