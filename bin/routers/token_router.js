const t_router = require("express").Router();
const { verifyToken } = require("../controllers/token_controller");


t_router.get("/verify", (req, res) => {
  let token = req.query.token;
  verifyToken(token, (status, response) => {
    res.status(status);
    res.json(response);
  });
});


module.exports = t_router;