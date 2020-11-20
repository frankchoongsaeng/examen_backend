const userRouter = require("express").Router();
const { login, signup } = require("../controllers/user_controller");

/**
 * POST - Create a new user in the user collection
 * REQUIRED - firstName, lastName, phone, email, password, tosAgreement
 * OPTIONAL - organizationName, organizationPosition
 * @TODO - Allow users to select organizations from available list of organizations 
 */
userRouter.post("/signup", (req, res) => {

  let body = req.body;

  signup(body, (statusCode, response) => {
    if(statusCode === 201) {
      delete response._id;
      delete response._v;
      res.setHeader("Set-Cookie", "authToken="+ response.token);
    }
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

  let body = req.body;
  let token = req.headers.cookie;
  console.log(req.headers);
  
  
  login(body, token, (statusCode, response) => {
    if(statusCode === 200) {
      delete response.response._id;
      delete response.response.__v;
      res.setHeader("Set-Cookie", "authToken="+ response.response.token);
    }
    res.status(statusCode);
    res.json(response);
  })

});


module.exports = userRouter;