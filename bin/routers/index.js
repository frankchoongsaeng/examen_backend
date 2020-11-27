// DEPENDENCIES
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const notFound = require("./not_found");
const userRouter = require("./user_router");
const examRouter = require("./exam_router");
const tokenRouter = require("./token_router");
const questionRouter = require("./question_router");
const { isValidToken } = require("../utils/is_valid_token");
// const submissionRouter = require("./submission_router");


// enable cross-origin-requests
router.use(cors());

// router.use("*", express.static(path.join(__dirname, "../../public/")));

// parse body of request to json
router.use(bodyParser.json());

router.use(isValidToken);

router.use("/api/users", userRouter);

router.use("/api/exams", examRouter);

router.use("/api/questions", questionRouter);

router.use("/api/token", tokenRouter);


// Router.use("/submissions", submissionRouter);

// trap all wrong request
router.use(notFound);

// router.use(express.static());

module.exports = router;