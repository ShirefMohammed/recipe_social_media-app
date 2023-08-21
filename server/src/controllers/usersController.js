const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");
const RecipeModel = require("../models/recipeModel");

// Get user by userId
const getUserById = async (req, res) => {
  const { userId } = req.params;
  const {
    fullData,
    createdRecipesLimit,
    savedRecipesLimit,
    followingStartIdx,
    followingLimit,
    followersStartIdx,
    followersLimit
  } = req.query;

  try {
    if (!fullData) {
      const user = await UserModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    } else {
      const user = await UserModel.findById(userId)
        .populate({
          path: "savedRecipes",
          populate: { path: "owner" },
          options: { limit: savedRecipesLimit }
        })
        .populate({
          path: "createdRecipes",
          populate: { path: "owner" },
          options: { limit: createdRecipesLimit }
        })
        .populate({
          path: "following",
          options: {
            limit: followingLimit,
            skip: followingStartIdx
          }

        })
        .populate({
          path: "followers",
          options: {
            limit: followersLimit,
            skip: followersStartIdx
          }
        });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get suggested users
const getSuggestedUsers = async (req, res) => {
  try {
    const { userId, limit } = req.query;

    const user = await UserModel.findById(userId);

    const suggestedUsers = await UserModel.aggregate([
      {
        $match: {
          _id: {
            $ne: user._id,
            $nin: [...user.following, ...user.followers]
          }
        }
      },
      { $sample: { size: parseInt(limit) } }
    ]);

    res.status(200).json({ suggestedUsers: suggestedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update User Account
const updateAccount = async (req, res) => {
  const {
    userId,
    accountBg,
    picture,
    bio,
    oldPassword,
    newPassword,
    userFollowedId,
    userUnFollowedId
  } = req.body;

  try {
    if (accountBg) {
      await UserModel.updateOne({ _id: userId }, { accountBg });
    }

    if (picture) {
      await UserModel.updateOne({ _id: userId }, { picture });
    }

    if (bio) {
      await UserModel.updateOne({ _id: userId }, { bio });
    }

    if (oldPassword && newPassword) {
      const user = await UserModel.findById(userId);
      const isPassValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPassValid) {
        return res.status(200).json({
          changed: false,
          message: "Old password is incorrect"
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updateOne({ _id: userId }, { password: hashedPassword });

      return res.status(200).json({
        changed: true,
        message: "Password changed successfully"
      });
    }

    if (userFollowedId) {
      const user = await UserModel.findById(userId);

      if (user.following.includes(userFollowedId)) {
        return res.status(200).json({ followed: false });
      }

      await UserModel.updateOne(
        { _id: userId },
        { $push: { following: userFollowedId } }
      );

      return res.status(200).json({ followed: true });
    }

    if (userUnFollowedId) {
      await UserModel.updateOne(
        { _id: userId },
        { $pull: { following: userUnFollowedId } }
      );

      return res.status(200).json({ unFollowed: true });
    }

    const user = await UserModel.findById(userId)
      .populate("savedRecipes")
      .populate("createdRecipes")
      .populate("following")
      .populate("followers");

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete User Account
const deleteAccount = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const user = await UserModel.findById(userId);

    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
      return res.status(200).json({
        deleted: false,
        message: "Password is incorrect"
      });
    }

    const deletedUser = await UserModel.deleteOne({ _id: userId });

    if (deletedUser.acknowledged) {
      res.status(200).json({
        deleted: true,
        message: "Your account has been deleted successfully"
      });
    } else {
      res.status(200).json({
        deleted: false,
        message: "Your account was not deleted"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserById,
  getSuggestedUsers,
  updateAccount,
  deleteAccount
};
