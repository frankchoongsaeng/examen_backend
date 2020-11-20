const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports.comparePassword = function(pass, hashedPass) {
  let isAMatch = false;
  try {
    isAMatch = bcrypt.compareSync(pass, hashedPass);
  } 
  catch( e ) {
    console.log("could not compare passwords");
    console.error(e);
    console.log("==============================================================================");
  }

  return isAMatch;
}

module.exports.hashPassword = function(pass) {
  let hashedPass = "";
  
  try{
    let salt = bcrypt.genSaltSync(parseInt(process.env.SALT));
    hashedPass = bcrypt.hashSync(pass, salt);
  }
  catch ( e ) {
    console.error("could not hash password");
    console.error(e);
    console.log("==============================================================================");
  }

  return hashedPass;
} 