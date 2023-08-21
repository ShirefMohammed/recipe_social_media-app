const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: true },
  picture: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsGj1gTQDfDDEITpWX28zr_fgkkOFJBTmqyg&usqp=CAU"
  },
  accountBg: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1H4PZrSs0p0fQXR6f-IUvezMdjcgxrFjCkg&usqp=CAU"
  },
  bio: {
    type: String,
    default: "has no bio"
  },
  following: [{ type: Schema.Types.ObjectId, ref: "users" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "users" }],
  createdRecipes: [{ type: Schema.Types.ObjectId, ref: "recipes" }],
  savedRecipes: [{ type: Schema.Types.ObjectId, ref: "recipes" }]
});

const UserModel = model("users", UserSchema);
module.exports = UserModel;