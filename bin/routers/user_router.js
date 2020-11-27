const userRouter = require("express").Router();
const { login, signup, getAllExams } = require("../controllers/user_controller");

/**
 * POST - Create a new user in the user collection
 * REQUIRED - firstName, lastName, phone, email, password, tosAgreement
 * OPTIONAL - organizationName, organizationPosition
 * @TODO - Allow users to select organizations from available list of organizations 
 */
userRouter.post("/signup", (req, res) => {

  let body = req.body;

  signup(body, (statusCode, response) => {

    res.status(statusCode);
    res.json(response);
  })

});



/**
 * POST - login a user and provide and create a token
 * REQUIRED - firstName, lastName, phone, email, password, tosAgreement
 * OPTIONAL - organizationName, organizationPosition
 * @TODO - Allow users to select organizations from available list of organizations 
 */
userRouter.post("/login", (req, res) => {

  login(req.body, (statusCode, response) => {

    res.status(statusCode);
    res.json(response);
  })

});


/**
 * GET - get a users exams
 */
userRouter.get("/exams", (req, res) => {
  
  let token = req.headers.token;

  getAllExams(token, (statusCode, response) => {
    res.status(statusCode);
    res.json(response);
  })

});


module.exports = userRouter;