import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { GetServerAPI, GetUserId } from "../../hooks";

import style from "./Recipe.module.css";
import userAvatarAlt from "../../assets/userAvatarAlt.png";
import axios from "axios";

const api = GetServerAPI();
const userId = GetUserId();

const Recipe = () => {
  const [recipe, setRecipe] = useState({});
  const [publisher, setPublisher] = useState({});
  const [cookies] = useCookies();
  const { recipeId } = useParams();

  // SetRecipe && SetPublisher
  useEffect(() => {
    axios.get(`${api}/recipes/recipeId/${recipeId}`)
      .then(res => setRecipe(res.data.recipe));
    axios.post(`${api}/users/getUser`, { userId: recipe.userOwner })
      .then(res => setPublisher(res.data.user));
  }, [recipeId, recipe.userOwner]);

  // Save Recipe
  const saveRecipe = () => {
    axios.post(`${api}/recipes/saveRecipe`, {
      userId: userId,
      recipeId: recipe._id
    }).then(res => alert(res.data.message));
  }

  return (
    <section className={style.recipe}>
      {/* Publisher Account and Name */}
      <div className={style.publisher}>
        <Link to={`/users/${publisher?.username}`}>
          <img
            src={publisher?.userAvatar || userAvatarAlt}
            alt="Publisher Img" />
        </Link>
        <span> {publisher?.username || "Publisher Name"} </span>
      </div>

      {/* Recipe Image */}
      <div className={style.recipeImg}>
        <img src={recipe.imageUrl} alt="recipe imageUrl" />
      </div>

      {/* Recipe Name */}
      <h3 className={style.recipe_name}>
        {recipe.name}
      </h3>

      {/* Recipe Ingredients */}
      <div className={style.ingredients}>
        <h3>Recipe Ingredients</h3>
        <ol>
          {recipe?.ingredients?.split("\\n").map((ingredient, index) => {
            return ingredient && <li key={index}>{ingredient}</li>;
          })}
        </ol>
      </div>

      {/* Recipe Instructions */}
      <div className={style.instructions}>
        <h3>Recipe Instructions</h3>
        <ol>
          {recipe?.instructions?.split("\\n").map((instruction, index) => {
            return instruction && <li key={index}>{instruction}</li>;
          })}
        </ol>
      </div>

      {/* Recipe Cooking Time */}
      <div className={style.cooking_time}>
        <h3>Recipe Cooking Time</h3>
        <p>{recipe?.cookingTime}</p>
      </div>

      {/* Save Recipe Button */}
      {cookies.access_token &&
        <button
          className={style.save_recipe_btn}
          onClick={saveRecipe}>
          Save Recipe
          <i className="fa-regular fa-heart"></i>
        </button>}
    </section>
  )
}

export default Recipe
