const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");
const RecipeModel = require("../models/recipeModel");

// signUp
const signUp = async (req, res) => {
  const { name, email, password, picture } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      return res.status(200).json({
        created: false,
        message: "user already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name: name,
      email: email,
      password: hashedPassword,
      picture: picture
    });

    await newUser.save();

    res.status(200).json({
      created: true,
      message: "account created successfully"
    });
  }

  catch (error) {
    res.status(400).json(error);
  }
};

// signIn
const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(200).json({
        message: "account not exists"
      });
    }

    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
      return res.status(200).json({
        message: "email or password is incorrect"
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET);

    res.status(200).json({
      token: token,
      userId: user._id
    });
  }

  catch (error) {
    res.status(400).json(error);
  }
};

module.exports = { signUp, signIn };