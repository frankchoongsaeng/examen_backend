const router = require("express").Router();
const { getAllExams, createNewExam, editCreatedExam } = require("../controllers/exam_controller");

router.get("/", (req, res) => {

  let token = req.headers.token;

  console.debug(req.headers.token)

  getAllExams(token, (status, response) => {
    res.status(status);
    res.json(response);
  });

});

router.post("/create", (req, res) => {
  let data = req.body;
  let token = req.headers.token;
  console.log("")
  console.log("new api/exams/create request");
  console.log("")
  createNewExam({token: token, ...data}, (status, response) => {
    res.status(status);
    res.json(response);
  });
});

router.post("/submissions", (req, res) => {
  res.send("Get /exams");
});

module.exports = router;