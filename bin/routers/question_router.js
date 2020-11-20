const router = require("express").Router();
const { createOrUpdate } = require("../controllers/question_controller");


router.post("/", (req, res) => {

  createOrUpdate(req.body, (status, response) => {
    res.status(status);
    res.json(response);
  });
  
});

module.exports = router;