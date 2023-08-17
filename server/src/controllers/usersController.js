const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");
const RecipeModel = require("../models/recipeModel");

// Get user by userId
const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(200).json({ message: "not found" });
    }

    res.status(200).json({ user: user });
  }

  catch (error) {
    res.status(400).json(error);
  };
}

// Get user by name
const getUserByName = async (req, res) => {
  const { name } = req.params;

  try {
    const user = await UserModel.findOne({ name: name });

    if (!user) {
      return res.status(200).json({ message: "not found" });
    }

    res.status(200).json({ user: user });
  }

  catch (error) {
    res.status(400).json(error);
  };
}

// Get user by email
const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(200).json({ message: "not found" });
    }

    res.status(200).json({ user: user });
  }

  catch (error) {
    res.status(400).json(error);
  };
}

// Update User Account
const updateAccount = async (req, res) => {
  const {
    userId, accountBg, picture,
    bio, oldPassword, newPassword
  } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (accountBg) {
      user.accountBg = accountBg;
      await user.save();
      return res.status(200).json({ user: user });
    }

    if (picture) {
      user.picture = picture;
      await user.save();
      return res.status(200).json({ user: user });
    }

    if (bio) {
      user.bio = bio;
      await user.save();
      return res.status(200).json({ user: user });
    }

    if (oldPassword && newPassword) {
      const isPassValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPassValid) {
        return res.status(200).json({
          changed: false,
          message: "old password is wrong"
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({
        changed: true,
        message: "password changed successfully"
      });
    }
  }

  catch (error) {
    res.status(400).json(error);
  };
}

// Delete User Account
const deleteAccount = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await UserModel.findById(userId);

    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
      return res.status(200).json({
        deleted: false,
        message: "password is wrong"
      });
    }

    const deletedUser = await UserModel.deleteOne({ _id: userId });

    deletedUser.acknowledged ?
      res.status(200).json({
        deleted: true,
        message: "your account deleted successfully"
      })
      : res.status(200).json({
        deleted: false,
        message: "your account was't deleted"
      });
  }

  catch (error) {
    res.status(400).json(error);
  };
}

module.exports = {
  getUserById, getUserByName, getUserByEmail,
  updateAccount, deleteAccount
};
