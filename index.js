// configure the environment variables
require("dotenv").config();

// DEPENDENCIES
const app = require("express")();
const router = require("./bin/routers/");
const server = require("./bin/utils/server");

// router handle all route requests
app.use(router);

// start the server
server.start(app);