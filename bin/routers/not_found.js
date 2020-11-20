const notFound = require("express").Router();

notFound.use((req, res) => {
  res.status(400).json({
    "response": "Invalid path, a comprehensive list of routes and methods are given below",
    "paths": {
      "/api/users": "POST || GET",
    }
  });
})

module.exports = notFound;