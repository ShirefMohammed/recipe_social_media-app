/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { GetServerUrl } from "../../hooks";
import { appContext } from "../../App";
import style from "./RecipeCard.module.css";
import axios from "axios";
import userPictureAlt from "../../assets/userPictureAlt.png";
const serverUrl = GetServerUrl();

const RecipeCard = ({ recipe, setSavedRecipes, setCreatedRecipes }) => {
  const { userId, cookies } = useContext(appContext);
  const [publisher, setPublisher] = useState({});
  const { pathname } = useLocation();

  useEffect(() => {
    const getPublisher = async () => {
      axios.get(`${serverUrl}/users/getUser/userId/${recipe.owner}`)
        .then(res => setPublisher(res.data.user));
    }
    getPublisher();
  }, [recipe]);

  const saveRecipe = async () => {
    try {
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
      });
    } catch (error) {
      console.log(error);
    }
  }

  const unSaveRecipe = async () => {
    try {
      axios.post(`${serverUrl}/recipes/unSaveRecipe`, {
        userId: userId,
        recipeId: recipe._id
      }).then(res => {
        const { message, savedRecipes } = res.data;
        setSavedRecipes(savedRecipes);
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  const removeCreatedRecipe = async () => {
    try {
      axios.post(`${serverUrl}/recipes/removeCreatedRecipe`, {
        userId: userId,
        recipeId: recipe._id
      }).then(res => {
        const { message, createdRecipes } = res.data;
        setCreatedRecipes(createdRecipes);
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={style.recipe_card}>
      {/* Top */}
      <div className={style.publisher}>
        <Link to={`/users/${publisher?._id}`}>
          <img src={publisher?.picture || userPictureAlt} alt="" />
        </Link>
        <span>
          {publisher?.name || "Publisher Name"}
        </span>
      </div>

      {/* Middle */}
      <Link to={`/recipes/${recipe._id}`} className={style.recipe_img}>
        <img src={recipe.imageUrl} alt="recipe imageUrl" />
      </Link>

      {/* Bottom */}
      <div className={style.bottom_div}>
        <h3 className={style.recipe_name}>
          {recipe.title}
        </h3>

        {
          cookies.access_token
          && pathname !== "/userPortfolio"
          && pathname !== "/recipes/savedRecipes"
          && <button
            className={style.save_recipe_btn}
            title="save recipe"
            onClick={saveRecipe} >
            <i className="fa-regular fa-heart"></i>
          </button>
        }

        {
          cookies.access_token
          && pathname === "/recipes/savedRecipes"
          && <button
            className={style.save_recipe_btn}
            title="unSave recipe"
            onClick={unSaveRecipe} >
            <i className={`fa-solid fa-heart ${style.solid_heart}`}></i>
          </button>
        }

        {
          cookies.access_token
          && pathname === "/userPortfolio"
          && <button
            className={style.save_recipe_btn}
            title="remove created recipe"
            onClick={removeCreatedRecipe} >
            <i className="fa-solid fa-trash"></i>
          </button>
        }
      </div>
    </div>
  )
}

export default RecipeCard
