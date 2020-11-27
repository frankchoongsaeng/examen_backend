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
      callback(200, data);
    }
    else {

      data.token = token;
      data.isvalid = false;

      // send the token data back to the user 
      callback(200, data);
    }
  });
}


module.exports = { verifyToken };
