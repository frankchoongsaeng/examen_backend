const jwt = require("jsonwebtoken");

function verifyToken(token, callback) {

  // define an empty response object
  let data = {};

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (decoded) {

      data.userId = decoded.id;
      data.token = token;
      data.isvalid = true;

      // send the token data back to the user 
      return callback(true, data);

    }
    else {
      // send the token data back to the user
      return callback(false);
    }
  });
}

function isValidToken(req, res, next) {
  let loginpath = /[a-z]*\/login/g.test(req.path);
  let signuppath = /[a-z]*\/signup/g.test(req.path);
  
  if (!(loginpath || signuppath)) {
    let token = req.headers.token;
    verifyToken(token, (isvalid, data) => {
      if(!isvalid) {
        console.log("token is invalid, exiting user...");
        res.status(401);
        return res.json({"response": "missing or invalid token"});
      }

      req.body.userData = data;
      next();
    });
  }
  else  {
    next();
  }

}


module.exports = { isValidToken };
