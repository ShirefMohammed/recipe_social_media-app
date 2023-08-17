import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GetServerUrl } from "../../hooks";
import { toast } from "react-toastify";
import { appContext } from "../../App";
import style from "./Recipe.module.css";
import userPictureAlt from "../../assets/userPictureAlt.png";
import axios from "axios";
const serverUrl = GetServerUrl();

const Recipe = () => {
  const { cookies, userId } = useContext(appContext);
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState({});
  const [publisher, setPublisher] = useState({});

  useEffect(() => {
    const getRecipe = async () => {
      axios.get(`${serverUrl}/recipes/recipeId/${recipeId}`)
        .then(res => setRecipe(res.data.recipe))
        .catch(error => console.log(error));
    }
    getRecipe();
  }, [recipeId]);

  useEffect(() => {
    const getPublisher = async () => {
      if (!recipe?._id) return;
      axios.get(`${serverUrl}/users/getUser/userId/${recipe.owner}`)
        .then(res => setPublisher(res.data.user));
    }
    getPublisher();
  }, [userId, recipe]);

  // Save Recipe
  const saveRecipe = async () => {
    axios.post(`${serverUrl}/recipes/saveRecipe`, {
      userId: userId,
      recipeId: recipe._id
    }).then(res => {
      toast.success(res.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    })
      .catch(error => console.log(error));
  }

  return (
    <section className={style.recipe}>
      {/* Publisher Account and Name */}
      <div className={style.publisher}>
        <Link to={`/users/${publisher?._id}`}>
          <img
            src={publisher?.picture || userPictureAlt}
            alt="publisher picture" />
        </Link>
        <span> {publisher?.name || "publisher name"} </span>
      </div>

      {/* Recipe Image */}
      <div className={style.recipeImg}>
        <img src={recipe.imageUrl} alt="recipe imageUrl" />
      </div>

      {/* Recipe Name */}
      <h3 className={style.recipe_name}>
        {recipe.title}
      </h3>

      {/* Recipe Ingredients */}
      <div className={style.ingredients}>
        <h3>Recipe Ingredients</h3>
        <ol>
          {recipe?.ingredients?.map((ingredient, index) => {
            return ingredient && <li key={index}>{ingredient}</li>;
          })}
        </ol>
      </div>

      {/* Recipe Instructions */}
      <div className={style.instructions}>
        <h3>Recipe Instructions</h3>
        <ol>
          {recipe?.instructions?.map((instruction, index) => {
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
          onClick={saveRecipe}
        >
          Save Recipe
          <i className="fa-regular fa-heart"></i>
        </button>}
    </section>
  )
}

export default Recipe
