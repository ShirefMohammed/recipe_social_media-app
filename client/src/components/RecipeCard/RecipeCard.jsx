/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GetServerUrl } from "../../hooks";
import { AppContext } from "../../App";
import { PortfolioContext } from "../../pages/UserPortfolio/UserPortfolio";
import { RotatingLines } from "react-loader-spinner";
import style from "./RecipeCard.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const RecipeCard = ({ recipe, regularBookMark, solidBookMark, trash }) => {
  const { userId, cookies } = useContext(AppContext);
  const [btnStatus, setBtnStatus] = useState({
    regularBookMark: regularBookMark,
    solidBookMark: solidBookMark,
    trash: trash,
  });

  return (
    <div className={style.recipe_card}>
      {/* Top */}
      <div className={style.owner}>
        <Link to={`/users/${recipe.owner._id}`}>
          <img
            src={recipe.owner.picture}
            alt="user picture"
          />
        </Link>
        <span>
          {recipe.owner.name}
        </span>
      </div>

      {/* Middle */}
      <Link to={`/recipes/${recipe._id}`} className={style.recipe_img}>
        <img src={recipe.imageUrl} alt="recipe image" />
      </Link>

      {/* Bottom */}
      <div className={style.bottom_div}>
        <h3 className={style.recipe_name}>
          {recipe.title}
        </h3>

        {
          cookies.access_token
          && btnStatus.regularBookMark
          && <SaveBtn
            userId={userId}
            recipeId={recipe._id}
            setBtnStatus={setBtnStatus}
          />
        }

        {
          cookies.access_token
          && btnStatus.solidBookMark
          && <UnSaveBtn
            userId={userId}
            recipeId={recipe._id}
            setBtnStatus={setBtnStatus}
          />
        }

        {
          cookies.access_token
          && btnStatus.trash
          && <RemoveBtn
            userId={userId}
            recipeId={recipe._id}
          />
        }
      </div>
    </div>
  )
}

const SaveBtn = ({ userId, recipeId, setBtnStatus }) => {
  const [loading, setLoading] = useState(false);

  const saveRecipe = async () => {
    try {
      setLoading(true);
      const promise = await axios.post(`${serverUrl}/recipes/saveRecipe`, {
        userId: userId,
        recipeId: recipeId
      });
      if (promise.data.saved) {
        setBtnStatus(prev => ({
          ...prev,
          "regularBookMark": false,
          "solidBookMark": true,
        }));
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button
      disabled={loading}
      style={loading ? { opacity: ".5", cursor: "revert" } : {}}
      title="save recipe"
      onClick={saveRecipe}
    >
      {
        loading ?
          <RotatingLines
            strokeColor="gray"
            strokeWidth="5"
            animationDuration="0.75"
            width="20"
            visible={true}
          />
          : <i className="fa-regular fa-bookmark"></i>
      }
    </button>
  )
}

const UnSaveBtn = ({ userId, recipeId, setBtnStatus }) => {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useContext(PortfolioContext) || {};

  const unSaveRecipe = async () => {
    try {
      setLoading(true);
      const promise = await axios.post(`${serverUrl}/recipes/unSaveRecipe`, {
        userId: userId,
        recipeId: recipeId
      });
      if (promise.data.unSaved) {
        setBtnStatus(prev => ({
          ...prev,
          "regularBookMark": true,
          "solidBookMark": false,
        }));
        if (user?._id) {
          const savedRecipes = user.savedRecipes.filter(recipe =>
            recipe._id != recipeId);
          setUser(prev => ({ ...prev, "savedRecipes": savedRecipes }));
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button
      disabled={loading}
      style={loading ? { opacity: ".5", cursor: "revert" } : {}}
      className={style.unSave_btn}
      title="unsave recipe"
      onClick={unSaveRecipe}
    >
      {
        loading ?
          <RotatingLines
            strokeColor="gray"
            strokeWidth="5"
            animationDuration="0.75"
            width="20"
            visible={true}
          />
          : <i className="fa-solid fa-bookmark"></i>
      }
    </button>
  )
}

const RemoveBtn = ({ userId, recipeId }) => {
  const { user, setUser } = useContext(PortfolioContext) || {};
  const [loading, setLoading] = useState(false);

  const removeCreatedRecipe = async () => {
    try {
      setLoading(true);
      const promise = await axios.post(`${serverUrl}/recipes/removeCreatedRecipe`, {
        userId: userId,
        recipeId: recipeId
      })
      if (promise.data.removed && user?._id) {
        const createdRecipes = user.createdRecipes.filter(recipe =>
          recipe._id != recipeId);
        const savedRecipes = user.savedRecipes.filter(recipe =>
          recipe._id != recipeId);
        setUser(prev => ({
          ...prev,
          "createdRecipes": createdRecipes,
          "savedRecipes": savedRecipes
        }));
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button
      disabled={loading}
      style={loading ? { opacity: ".5", cursor: "revert" } : {}}
      title="remove created recipe"
      onClick={removeCreatedRecipe}
    >
      {
        loading ?
          <RotatingLines
            strokeColor="gray"
            strokeWidth="5"
            animationDuration="0.75"
            width="20"
            visible={true}
          />
          : <i className="fa-solid fa-trash"></i>
      }
    </button>
  )
}

export default RecipeCard
