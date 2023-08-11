import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { GetServerAPI, GetUserId, ConvertToBase64 } from "../../hooks";

import style from "./CreateRecipe.module.css";
import whiteImg from "../../assets/whiteImg.png"
import axios from "axios";

const api = GetServerAPI();
const userId = GetUserId();

const CreateRecipe = () => {
  const [recipe, setRecipe] = useState({ userOwner: userId });
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  // Check If User Account Not Exist Guest Can't Create Recipe
  useEffect(() => {
    !cookies.access_token && navigate("*");
  }, [cookies, navigate]);

  // Handle Inputs Change 
  const handleChange = ({ target }) => {
    setRecipe(prev => ({ ...prev, [target.name]: target.value }));
  }

  // Handle Recipe Image Input File Change
  const handleRecipeImg = async ({ target }) => {
    const recipeImg = target.files[0];
    const base64 = await ConvertToBase64(recipeImg);
    target.parentElement
      .querySelector('input[name="imageUrl"]').value = base64;
    setRecipe(prev => ({ ...prev, "imageUrl": base64 }));
  }

  // Handle Submit For Create Recipe Form
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${api}/recipes/createRecipe`, {
      recipe: {
        name: recipe.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cookingTime: recipe.cookingTime,
        imageUrl: recipe.imageUrl,
        userOwner: recipe.userOwner
      },
      userId: userId
    }).then(res => alert(res.data.message));

    setRecipe({ userOwner: userId });

    Array.from(e.target.elements).map(element => element.value = "");
  }

  return (
    <div className={style.create_recipe}>
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Recipe Name"
          onChange={handleChange}
          required />
        <textarea
          name="ingredients"
          placeholder="Recipe Ingredients (End Every Ingredient with \n)"
          onChange={handleChange}
          required></textarea>
        <textarea
          name="instructions"
          placeholder="Recipe Instructions (End Every Instruction with \n)"
          onChange={handleChange}
          required></textarea>
        <input
          type="text"
          name="cookingTime"
          placeholder="Recipe CookingTime"
          onChange={handleChange}
          required />
        <div className={style.recipe_img}>
          <input
            type="text"
            name="imageUrl"
            placeholder="Recipe Image Url"
            onChange={handleChange}
            required />
          <label
            className="circle_btn"
            htmlFor="recipeImgFile"
            title="Upload Image From Your Device">
            <i className="fa-solid fa-arrow-up-from-bracket"></i>
          </label>
          <input
            type="file"
            name="recipeImgFile"
            id="recipeImgFile"
            accept=".jpeg, .jpg,.png"
            onChange={handleRecipeImg} />
        </div>
        <div className={style.selected_img}>
          <img
            src={recipe.imageUrl || whiteImg}
            alt="Selected Image Not Exist" />
        </div>
        <button type="submit">Create Recipe</button>
      </form>
    </div>
  )
}

export default CreateRecipe
