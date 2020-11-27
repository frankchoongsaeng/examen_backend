const router = require("express").Router();
const { 
  getAllExams, 
  createNewExam, 
  addQuestionToExam, 
  getExamById, 
  deleteExamById, 
  editCreatedExam,
  getPublishedExams,
  publishExam
} = require("../controllers/exam_controller");
const { isValidToken } = require("../utils/is_valid_token");





/**
 * EXAMS - GET
 * get all published exams
 */
router.get("/published", (req, res) => {
  console.log(req.body.userData.userId)

  getPublishedExams(req.body.userData.userId, (status, response) => {
    res.status(status);
    res.json(response);
  });

});



/**
 * EXAMS - GET
 * gets a particular exam by it's id
 */
router.get("/:id", (req, res) => {

  let token = req.headers.token;
  let id =  req.params.id;

  getExamById({ token, id }, (status, response) => {
    res.status(status);
    res.json(response);
  });

});



/**
 * EXAMS - GET
 * gets a questions of a particular exam 
 * provided that examId
 */
router.get("/:id/questions", (req, res) => {

  let token = req.headers.token;
  let id =  req.params.id;

  getExamById({ token, id }, (status, response) => {
    if(status === 200) {
      response = JSON.parse(JSON.stringify(response));
      response = response.questions;
    }

    res.status(status);
    res.json(response);
  });

});



/**
 * EXAMS - GET
 * get all exams belonging to a specific user
 * @todo use the users  id to fetch the exam
 */
router.get("/", (req, res) => {

  let token = req.headers.token;

  getAllExams(token, (status, response) => {
    res.status(status);
    res.json(response);
  });

});



/**
 * EXAMS - DELETE
 * deletes a particular exam by it's id
 */
router.delete("/:id", (req, res) => {

  let token = req.headers.token;
  let id =  req.params.id;

  deleteExamById({ token, id }, (status, response) => {
    res.status(status);
    res.json(response);
  });

});


/**
 * EXAMS - POST
 * creates a new exam 
 */
router.post("/create", (req, res) => {
  let data = req.body;
  let token = req.headers.token;
  createNewExam({token: token, ...data}, (status, response) => {
    res.status(status);
    res.json(response);
  });
});



/**
 * EXAMS - POST
 * adds a question list to the current exam 
 * provided that examId
 */
router.post("/question", (req, res) => {
  let data = req.body;
  let token = req.headers.token;

  addQuestionToExam({token: token, ...data}, (status, response) => {
    res.status(status);
    res.json(response);
  });
});



/**
 * EXAMS - POST
 * publishes a new exam 
 * provided that examId
 */
router.post("/:id/publish", (req, res) => {
  let data = req.body;
  let id = req.params.id;

  publishExam( id, data, (status, response) => {
    res.status(status);
    res.json(response);
  });
});




router.post("/submissions", (req, res) => {
  res.send("Get /exams");
});

module.exports = router;