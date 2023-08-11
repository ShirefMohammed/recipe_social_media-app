/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import { GetServerAPI, GetUserId } from "../../hooks";

import style from "./RecipeCard.module.css";
import userAvatarAlt from "../../assets/userAvatarAlt.png";
import axios from "axios";

const api = GetServerAPI();
const userId = GetUserId();

const RecipeCard = ({ recipe, setSavedRecipes }) => {
  const [publisher, setPublisher] = useState({});
  const [cookies] = useCookies(["access_token"]);
  const { pathname } = useLocation();

  // Get User Who Published Recipe Post
  useEffect(() => {
    axios.post(`${api}/users/getUser/`, { userId: recipe.userOwner })
      .then(res => setPublisher(res.data.user));
  }, [recipe.userOwner]);

  // Save Recipe Function
  const saveRecipe = () => {
    axios.post(`${api}/recipes/saveRecipe`, {
      userId: userId,
      recipeId: recipe._id
    }).then(res => alert(res.data.message));
  }

  // Remove Saved Recipe Function
  const UnSavedRecipe = () => {
    axios.post(`${api}/recipes/unSavedRecipe`, {
      userId: userId,
      recipeId: recipe._id
    }).then(res => setSavedRecipes(res.data.savedRecipes));
  }

  return (
    <div className={style.recipe}>
      {/* Publisher */}
      <div className={style.publisher}>
        <Link to={`/users/${publisher?.username}`}>
          <img
            src={publisher?.userAvatar || userAvatarAlt}
            alt="Publisher Img" />
        </Link>
        <span>
          {publisher?.username || "Publisher Name"}
        </span>
      </div>

      {/* Recipe Image Link */}
      <Link to={`/recipes/recipeId/${recipe._id}`} className={style.recipeImg}>
        <img src={recipe.imageUrl} alt="recipe imageUrl" />
      </Link>

      {/* Recipe Name and Save and UnSave Recipe Buttons */}
      <div>
        <h3 className={style.recipe_name}>
          {recipe.name}
        </h3>

        {cookies.access_token && pathname !== "/recipes/savedRecipes" ?
          <button
            className={style.save_recipe_btn}
            title="save recipe"
            onClick={saveRecipe} >
            <i className="fa-regular fa-heart"></i>
          </button>
          : ""}

        {cookies.access_token && pathname === "/recipes/savedRecipes" ?
          <button
            className={style.un_saved_recipe_btn}
            title="remove from saved recipes"
            onClick={UnSavedRecipe} >
            <i className="fa-solid fa-trash-can"></i>
          </button>
          : ""}
      </div>
    </div>
  )
}

export default RecipeCard
