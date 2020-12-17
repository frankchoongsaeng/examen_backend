const notFound = require("express").Router();

notFound.use((req, res) => {
  res.status(400).json({
    "response": "Invalid path, a comprehensive list of routes respective methods are given below",
    "paths": {
      "submissions": {
        "/api/submissions/single/:email": {
          "method": "GET" 
        },
        "/api/submissions/finish": {
          "method": "POST",
          "body": {
            "_id": "Submission Id",
            "examId": "Exam Id"
          }
        },
        "/api/submissions/:id": {
          "method": "POST",
          "body": [ "response list" ]
        },
      },
      "users" : {
        "/api/users/login": {
          "method": "POST",
          "body": {
            "email": "string",
            "password": "string, >= 8"
          }
        },
        "/api/users/signup": {
          "method": "POST",
          "body": {
            "email": "string",
            "password": "string, length >= 8",
            "firstName": "string", 
            "lastName": "string", 
            "phone": "string, length = 10",
            "tosAgreement": "boolean, must be true"
          }
        },
        "/api/users/exams": {
          "method": "GET",
          "headers": {
            "token": "string: JSONWebToken"
          }
        }
      },
      "exams": {
        "/api/exams/published/:hex/:title": {
          "method": "GET"
        }
      },
      "/api/questions": "POST || GET",
      "/api/token": "POST || GET",
      "/api/users": "POST || GET",
    }
  });
})

module.exports = notFound;