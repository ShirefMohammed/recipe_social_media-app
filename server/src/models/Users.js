const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountBg: { type: String },
  userAvatar: { type: String },
  bio: { type: String },
  createdRecipes: [{ type: Schema.Types.ObjectId }],
  savedRecipes: [{ type: Schema.Types.ObjectId }]
});

const UserModel = model("users", UserSchema);
module.exports = UserModel;