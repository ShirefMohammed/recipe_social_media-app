const express = require("express");

const RecipeModel = require("../models/recipeModel");
const UserModel = require("../models/userModel");

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await RecipeModel.find();
    res.json({ recipes: recipes });
  }
  catch (err) {
    console.log(err);
  }
}

// Get recipe by id
const getRecipeById = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await RecipeModel.findById(recipeId);
    res.json({ recipe: recipe });
  }

  catch (err) {
    console.log(err);
  }
}

// Get saved recipes
const getSavedRecipes = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await UserModel.findById(userId);

    const savedRecipes = await Promise.all(user.savedRecipes
      .map(async (recipeId) => {
        const recipe = await RecipeModel.findById(recipeId);
        return recipe;
      }));

    res.json({ savedRecipes: savedRecipes });
  }

  catch (err) {
    console.log(err);
  }
}

// Get created recipes by userId or email
const getCreatedRecipes = async (req, res) => {
  const { userId, email } = req.body;

  try {
    let user;

    userId ? user = await UserModel.findById(userId)
      : email ? user = await UserModel.findOne({ email: email })
        : false;

    const createdRecipes = await Promise.all(user.createdRecipes
      .map(async (recipeId) => {
        const recipe = await RecipeModel.findById(recipeId);
        return recipe;
      }));

    res.json({ createdRecipes: createdRecipes });
  }

  catch (err) {
    console.log(err);
  }
}

// Create new recipe
const createNewRecipe = async (req, res) => {
  const { recipe } = req.body;

  try {
    const newRecipe = new RecipeModel({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageUrl: recipe.imageUrl,
      cookingTime: recipe.cookingTime,
      owner: recipe.owner
    });

    await newRecipe.save();

    const user = await UserModel.findById(recipe.owner);

    user.createdRecipes.push(newRecipe._id);

    await user.save();

    res.json({ message: "recipe created successfully" });
  }

  catch (err) {
    console.log(err);
  }
}

// Save recipe
const saveRecipe = async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    const user = await UserModel.findById(userId);
    if (user.savedRecipes.includes(recipeId)) {
      res.status(200).json({ message: "recipe already saved" });
    } else {
      user.savedRecipes.push(recipeId);
      await user.save();
      res.status(200).json({ message: "recipe saved successfully" });
    }
  }

  catch (error) {
    res.status(400).json(error);
  }
}

// UnSave recipe
const unSaveRecipe = async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { savedRecipes: recipeId } }
    );

    const user = await UserModel.findById(userId);

    const savedRecipes = await Promise.all(
      user.savedRecipes.map(async (id) => {
        const recipe = await RecipeModel.findById(id);
        return recipe;
      })
    );

    res.status(200).json({
      savedRecipes: savedRecipes,
      message: "Recipe unsaved successfully"
    });
  } catch (error) {
    res.status(400).json(error);
  }
};

// Remove created recipe
const removeCreatedRecipe = async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    await RecipeModel.deleteOne({ _id: recipeId });

    await UserModel.updateOne(
      { _id: userId },
      { $pull: { createdRecipes: recipeId } }
    );

    await UserModel.updateOne(
      { _id: userId },
      { $pull: { savedRecipes: recipeId } }
    );

    const user = await UserModel.findById(userId);

    const createdRecipes = await Promise.all(
      user.createdRecipes.map(async (id) => {
        const recipe = await RecipeModel.findById(id);
        return recipe;
      })
    );

    res.status(200).json({
      createdRecipes: createdRecipes,
      message: "recipe deleted successfully"
    });
  }

  catch (error) {
    res.status(400).json(error);
  }
};

module.exports = {
  getAllRecipes, getRecipeById, getSavedRecipes, getCreatedRecipes,
  createNewRecipe, saveRecipe, unSaveRecipe, removeCreatedRecipe
};