const db_conn = require("../config/dbconnect");

const port = process.env.PORT || 5000;

module.exports.start = async (app) => {
  db_conn.connect(
    (err) => {
      if(err) {
        console.log("unable to connect to database");
        return;
      } 
      console.log("connection successfull");
      app.listen(port, () => console.log("server is now running on " + port))
    }
  )
}