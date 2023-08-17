const express = require("express");

const { getUserById, getUserByName, getUserByEmail, updateAccount, deleteAccount } = require("../controllers/usersController");

const router = express.Router();

// Get user by id
router.route("/getUser/userId/:userId").get(getUserById);

// Get user by name
router.route("/getUser/name/:name").get(getUserByName);

// Get user by email
router.route("/getUser/email/:email").get(getUserByEmail);

// Update User Account
router.route("/userPortfolio/updateAccount").post(updateAccount);

// Delete User Account
router.route("/userPortfolio/deleteAccount").post(deleteAccount);

module.exports = router;