const express = require("express");
const {
  getRecipes,
  getRecipeById,
  createNewRecipe,
  saveRecipe,
  unSaveRecipe,
  removeCreatedRecipe
} = require("../controllers/recipesController");
const router = express.Router();

// Get all recipes
router.route("/").get(getRecipes);

// Get recipe by id
router.route("/recipeId/:recipeId").get(getRecipeById);

// Create new recipe
router.route("/createNewRecipe").post(createNewRecipe);

// Save recipe
router.route("/saveRecipe").post(saveRecipe);

// UnSave recipe
router.route("/unSaveRecipe").post(unSaveRecipe);

router.route("/removeCreatedRecipe").post(removeCreatedRecipe);

module.exports = router;