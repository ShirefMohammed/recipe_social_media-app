const express = require("express");

const {
  getUserById,
  getSuggestedUsers,
  updateAccount,
  deleteAccount
} = require("../controllers/usersController");

const router = express.Router();

// Get user by id
router.route("/getUser/userId/:userId").get(getUserById);

// Get suggested users
router.route("/getSuggestedUsers").get(getSuggestedUsers);

// Update User Account
router.route("/userPortfolio/updateAccount").post(updateAccount);

// Delete User Account
router.route("/userPortfolio/deleteAccount").post(deleteAccount);

module.exports = router;