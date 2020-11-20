const userRouter = require("express").Router();
const { hashPassword, comparePassword } = require("../controllers/encrypt");
const User = require("../models/user");
const Token = require("../models/token");
const jwt = require("jsonwebtoken");


function signup({ firstName, lastName, phone, email, password, tosAgreement } = {}, callback) {

  // validate the data recieved
  firstName = typeof firstName === "string" && firstName.trim().length > 1 ? firstName.trim() : false;
  lastName = typeof lastName === "string" && lastName.trim().length > 1 ? lastName.trim() : false;
  phone = typeof phone === "string" && phone.trim().length === 10 ? phone.trim() : false;
  email = typeof email === "string" ? email.trim() : false;
  password = typeof password === "string" && password.trim().length >= 8 ? password.trim() : false;
  tosAgreement = typeof tosAgreement === "boolean" && tosAgreement ? true : false;

  if (firstName && lastName && phone && email && password && tosAgreement) {

    // continue to persist to database
    User.findOne({ email: email }, (err, userDoc) => {

      if (err) {
        callback(500, { "response": "could not query database, This is a problem on our end and we're working to fix it" });
        return;
      }

      if (!userDoc) {

        // user does not exist
        // continue to persist to database
        let new_user = {};
        new_user.firstName = firstName;
        new_user.lastName = lastName;
        new_user.phone = phone;
        new_user.email = email;
        new_user.password = hashPassword(password);

        let user_to_save = new User(new_user);
        user_to_save.save((err, _user) => {
          if (!err) {

            // sign and save a new token for the user
            // create a token that expires after 7 days
            jwt.sign({ id: _user._id }, process.env.SECRET, (jwt_err, signedData) => {

              if (!jwt_err) {
                let new_token = {};
                new_token.token = signedData;
                new_token.for = _user._id;

                let token_collection = new Token(new_token);
                token_collection.save((token_save_err, __stored_token) => {

                  if (!token_save_err) {

                    User.updateOne({ _id: _user._id }, { $push: { tokens: __stored_token._id }, $set: { currentToken: __stored_token._id } }, (update_user_err) => {

                      if (!update_user_err) {
                        callback(201, { "response": __stored_token });
                      }
                      else {
                        console.log(update_user_err);
                        callback(500, { "response": "unable to update user with token" });
                      }

                    })
                  }
                  else {
                    console.log(token_save_err);
                    callback(500, { "response": "unable to save usertoken" });
                  }

                });
              }
              else {
                console.log(jwt_err);
                callback(500, { "response": "unable to create token" });
              }
            });



          } else {
            callback(500, { "response": "Could not save register a new user, This is a problem on our end and we're working to fix it" });
          }
        })

      }
      else {

        // user already exist
        callback(409, { "response": "user already exists" });

      }
    })

  } else {
    callback(400, { "response": "Missing required parameters" })
  }
}



function login({ email, password }, token, callback) {

  // if(token)

  // validate the data recieved
  email = typeof email === "string" ? email.trim() : false;
  password = typeof password === "string" && password.trim().length >= 8 ? password.trim() : false;

  if (email && password) {

    // select * from User where "email" = email

    // continue to persist to database
    User.findOne({ "email": email }, (no_user_err, user) => {

      if(no_user_err) {
        callback(500, {"response" : "error performing a user search, this is a problem on our end and we're working to fix it"});
        return false;
      }

      if (user) {

        if (comparePassword(password, user.password)) {

          // create a token that expires after 7 days
          jwt.sign({ id: user._id }, process.env.SECRET, (jwt_err, signedData) => {

            if (!jwt_err) {
              let new_token = {};
              new_token.token = signedData;
              new_token.for = user._id;

              let token_collection = new Token(new_token);
              token_collection.save((token_save_err, __stored_token) => {

                if (!token_save_err) {

                  User.updateOne({ _id: user._id }, { $push: { tokens: __stored_token._id }, $set: { currentToken: __stored_token._id } }, (update_user_err) => {

                    if (!update_user_err) {
                      console.log("Request completed");
                      callback(200, { "response": __stored_token });
                    }
                    else {
                      console.log(update_user_err);
                      callback(500, { "response": "unable to update user with token" });
                    }

                  })
                }
                else {
                  console.log(token_save_err);
                  callback(500, { "response": "unable to save usertoken" });
                }

              });
            }
            else {
              console.log(jwt_err);
              callback(500, { "response": "unable to create token" });
            }
          });


        } else {
          callback(401, { "response": "incorrect password" } )
        }
      }
      else {
        callback(404, { "response": "unable to find a user with that email, try signing up instead" });
      }

    });

  } else {
    callback(400, { "response": "Missing or invalid username or passwoord" });
  }
}


module.exports = {
  signup,
  login
}