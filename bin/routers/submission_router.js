const router = require('express').Router();
const { getSubmission, saveSubmission, saveResponseList, finishSubmission } = require('../controllers/submission_controller');




router.get("/single/:email", (req, res) => {

  getSubmission(req.params.email, (status, response) => {
    res.status(status);
    res.json(response);
  })
});




router.post("/finish", (req, res) => {

  finishSubmission(req.body._id, req.body, (status, response) => {
    res.status(status);
    res.json(response);
  })
});




router.post("/:id", (req, res) => {

  saveResponseList(req.params.id, req.body, (status, response) => {
    res.status(status);
    res.json(response);
  })
});




router.post("/", (req, res) => {

  saveSubmission(req.body, (status, response) => {
    res.status(status);
    res.json(response);
  })
});


module.exports = router;



/** 
 * req.body = { email: "frankchoongsaeng@gmail.com", firstName: "frank" }
 * 
 * req.body = { email: "frankchoongsaeng@gmail.com", lastName: "choongsaeng" }
 * 
 * User.updateOne({email: req.body.email}, { $set: req.body }, { new: true }, (err, newDocument) => {
 *  ...
 * });
*/