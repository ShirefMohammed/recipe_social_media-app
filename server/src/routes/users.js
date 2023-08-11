const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/Users");
const RecipeModel = require("../models/Recipes");

const router = express.Router();

// Sign Up
router.post("/sign/signUp", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });

    user && res.json({
      accountCreated: false,
      message: "user already exists"
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username: username,
      password: hashedPassword
    });

    await newUser.save();

    res.json({
      accountCreated: true,
      message: "account created successfully"
    });
  }

  catch (err) {
    console.log(err);
  }
});

// Sign In
router.post("/sign/signIn", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });

    !user && res.json({ message: "username or password is incorrect" });

    const isPassValid = await bcrypt.compare(password, user.password);

    !isPassValid && res.json({ message: "username or password is incorrect" });

    const token = jwt.sign({ id: user._id }, process.env.SECRET);

    res.json({ token, userId: user._id });
  }

  catch (err) {
    console.log(err);
  }
});

// Get user by userId Or username
router.post("/getUser", async (req, res) => {
  const { userId, username } = req.body;

  try {
    let user;

    userId ? user = await UserModel.findById(userId)
      : username ? user = await UserModel.findOne({ username: username })
        : false;

    res.json({ user: user });
  }

  catch (err) {
    console.log(err)
  };
});

// Update Account
router.post("/userPortfolio/updateAccount", async (req, res) => {
  const { userId, accountBg, userAvatar, bio, oldPassword, newPassword }
    = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (accountBg) {
      user.accountBg = accountBg;
      await user.save();
      res.json({ user: user });
    }

    if (userAvatar) {
      user.userAvatar = userAvatar;
      await user.save();
      res.json({ user: user });
    }

    if (bio) {
      user.bio = bio;
      await user.save();
      res.json({ user: user });
    }

    if (oldPassword && newPassword) {
      const isPassValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPassValid) {
        return res.json({ message: "old password is wrong" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "password changed successfully" });
    }
  }

  catch (err) {
    console.log(err);
  }
});

// Delete Account
router.post("/userPortfolio/deleteAccount", async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await UserModel.findById(userId);

    const isPassValid = await bcrypt.compare(password, user.password);

    !isPassValid && res.json({
      accountDeleted: false,
      message: "password is not correct"
    });

    const deletedUser = await UserModel.deleteOne({ _id: userId });

    deletedUser.acknowledged ?
      res.json({
        accountDeleted: true,
        message: "your account deleted successfully"
      })
      : res.json({
        accountDeleted: false,
        message: "your account was't deleted"
      });
  }

  catch (err) {
    console.log(err);
  }
});

module.exports = router;