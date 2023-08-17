const express = require("express");

const { signUp, signIn } = require("../controllers/authenticationController");

const router = express.Router();

router.route("/signUp").post(signUp);
router.route("/signIn").post(signIn);

module.exports = router;