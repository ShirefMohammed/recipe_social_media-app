const express = require("express");
const {
  getAllRecipes, getRecipeById, getSavedRecipes, getCreatedRecipes,
  createNewRecipe, saveRecipe, unSaveRecipe, removeCreatedRecipe
} = require("../controllers/recipesController");
const router = express.Router();

// Get all recipes
router.route("/").get(getAllRecipes);

// Get recipe by id
router.route("/recipeId/:recipeId").get(getRecipeById);

// Get saved recipes
router.route("/savedRecipes").post(getSavedRecipes);

// Get created recipes by userId or email
router.route("/createdRecipes/").post(getCreatedRecipes);

// Create new recipe
router.route("/createNewRecipe").post(createNewRecipe);

// Save recipe
router.route("/saveRecipe").post(saveRecipe);

// UnSave recipe
router.route("/unSaveRecipe").post(unSaveRecipe);

router.route("/removeCreatedRecipe").post(removeCreatedRecipe);

module.exports = router;