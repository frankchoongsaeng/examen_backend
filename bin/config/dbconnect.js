
const mongoose = require("mongoose");

// init mongoose connection
const uri = process.env.MONGODB_URI
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

// connect the database and start the database if the connection was successfull
module.exports.connect = (callback) => {
  console.log("connecting to database...")
  return mongoose.connect(uri, callback);
}