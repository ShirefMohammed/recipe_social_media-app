const { Schema, model } = require("mongoose");

const RecipeSchema = new Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: [{ type: String, required: true }],
  imageUrl: { type: String, required: true },
  cookingTime: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, required: true }
});

const RecipeModel = model("recipes", RecipeSchema);
module.exports = RecipeModel;