const router = require("express").Router();
const { createOrUpdate, getQuestion, deleteQuestion, getAllQuestionForExam } = require("../controllers/question_controller");
const { isValidToken } = require("../utils/is_valid_token");


/**
 * QUESTIONS - GET
 * get all question data related to an exam
 * required: examId as param
 */
router.get("/all/:id", (req, res) => {
  let id =  req.params.id;
  getAllQuestionForExam(id, (status, response) => {
    res.status(status);
    res.json(response);
  });
  
});



/**
 * QUESTIONS - GET
 * get data about a specific question
 * required: questionId as param
 */
router.get("/:id", (req, res) => {
  let id =  req.params.id;
  getQuestion(id, (status, response) => {
    res.status(status);
    res.json(response);
  });
  
});



/**
 * 
 * QUESTIONS - DELETE
 * delete a specific question
 * required: questionId as param
 */
router.delete("/:id", (req, res) => {
  let id =  req.params.id;
  deleteQuestion(id, (status, response) => {
    res.status(status);
    res.json(response);
  });
  
});




/**
 * QUESTIONS - POST
 * add question data to the  database
 * required: questiondata as body of request
 */
router.post("/", (req, res) => {

  createOrUpdate(req.body, (status, response) => {
    res.status(status);
    res.json(response);
  });
  
});


module.exports = router;