const express = require("express");

const RecipeModel = require("../models/recipeModel");
const UserModel = require("../models/userModel");

// Get recipes without excepted recipes and with limit
const getRecipes = async (req, res) => {
  try {
    const { excepted, limit } = req.query;

    if (excepted === "none") {
      const recipes = await RecipeModel.find().populate("owner").limit(limit);
      return res.status(200).json({ recipes: recipes });
    }

    else {
      const user = await UserModel.findById(excepted);

      const recipes = await RecipeModel.aggregate([
        {
          $match: {
            _id: {
              $nin: user.savedRecipes
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
          }
        },
        { $unwind: "$owner" },
        { $limit: parseInt(limit) }
      ]);

      res.status(200).json({ recipes: recipes });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get recipe by id
const getRecipeById = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const recipe = await RecipeModel.findById(recipeId)
      .populate("owner");

    if (!recipe) {
      res.status(200).json({ message: "recipe not found" });
    }

    res.status(200).json({ recipe: recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Create new recipe
const createNewRecipe = async (req, res) => {
  try {
    const { recipe } = req.body;

    const newRecipe = new RecipeModel({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageUrl: recipe.imageUrl,
      cookingTime: recipe.cookingTime,
      owner: recipe.owner
    });

    await newRecipe.save();

    await UserModel.updateOne(
      { _id: recipe.owner },
      { $push: { createdRecipes: newRecipe._id } }
    );

    res.status(200).json({ message: "Recipe created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Save recipe
const saveRecipe = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    const user = await UserModel.findById(userId);

    if (user.savedRecipes.includes(recipeId)) {
      res.status(200).json({ saved: true });
    } else {
      await UserModel.updateOne(
        { _id: userId },
        { $push: { savedRecipes: recipeId } }
      );
      res.status(200).json({ saved: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// UnSave recipe
const unSaveRecipe = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;

    await UserModel.updateOne(
      { _id: userId },
      { $pull: { savedRecipes: recipeId } }
    );

    res.status(200).json({ unSaved: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Remove created recipe
const removeCreatedRecipe = async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    await RecipeModel.deleteOne({ _id: recipeId });

    await UserModel.updateOne(
      { _id: userId },
      { $pull: { createdRecipes: recipeId, savedRecipes: recipeId } }
    );

    res.status(200).json({ removed: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getRecipes,
  getRecipeById,
  createNewRecipe,
  saveRecipe,
  unSaveRecipe,
  removeCreatedRecipe
};