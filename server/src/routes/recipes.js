const express = require("express");
const mongoose = require("mongoose");

const RecipeModel = require("../models/Recipes");
const UserModel = require("../models/Users");

const router = express.Router();

// Get All Recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await RecipeModel.find();
    res.json({ recipes: recipes });
  }
  catch (err) {
    console.log(err);
  }
});

// Get Recipe By ID
router.get("/recipeId/:recipeId", async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await RecipeModel.findById(recipeId);
    res.json({ recipe: recipe });
  }

  catch (err) {
    console.log(err);
  }
});

// Get Saved Recipes
router.post("/savedRecipes", async (req, res) => {
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
});

// Get Created Recipes By userId or username Who Created Them
router.post("/createdRecipes/", async (req, res) => {
  const { userId, username } = req.body;

  try {
    let user;

    userId ? user = await UserModel.findById(userId)
      : username ? user = await UserModel.findOne({ username: username })
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
});

// Create New Recipe
router.post("/createRecipe", async (req, res) => {
  const { recipe, userId } = req.body;

  try {
    const newRecipe = new RecipeModel({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      imageUrl: recipe.imageUrl,
      cookingTime: recipe.cookingTime,
      userOwner: recipe.userOwner
    });

    await newRecipe.save();

    const user = await UserModel.findById(userId);

    user.createdRecipes.push(newRecipe._id);

    await user.save();

    res.json({ message: "recipe created successfully" });
  }

  catch (err) {
    console.log(err);
  }
});

// Save Recipe
router.post("/saveRecipe", async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    const user = await UserModel.findById(userId);

    !user.savedRecipes.includes(recipeId) && user.savedRecipes.push(recipeId);

    await user.save();

    res.json({ message: "recipe saved Successfully" });
  }

  catch (err) {
    console.log(err);
  }
});

// UnSaved Recipe
router.post("/unSavedRecipe", async (req, res) => {
  const { userId, recipeId } = req.body;

  try {
    const user = await UserModel.findById(userId);

    user.savedRecipes = user.savedRecipes
      .filter(recipeID => recipeID != recipeId);

    await user.save();

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
});

module.exports = router;