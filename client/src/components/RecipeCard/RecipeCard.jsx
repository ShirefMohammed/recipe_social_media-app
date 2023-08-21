/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { GetServerUrl } from "../../hooks";
import { appContext } from "../../App";
import { portfolioContext } from "../../pages/UserPortfolio/UserPortfolio";
import { RotatingLines } from "react-loader-spinner";
import style from "./RecipeCard.module.css";
import axios from "axios";
import userPictureAlt from "../../assets/userPictureAlt.png";
const serverUrl = GetServerUrl();

const RecipeCard = ({
  recipe,
  regularBookMark,
  solidBookMark,
  trash
}) => {
  const { userId, cookies } = useContext(appContext);
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
          <img src={recipe.owner.picture || userPictureAlt} alt="" />
        </Link>
        <span>
          {recipe.owner.name || "owner name"}
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
    setLoading(true);
    await axios.post(`${serverUrl}/recipes/saveRecipe`, {
      userId: userId,
      recipeId: recipeId
    })
      .then(res => {
        const { saved } = res.data;
        if (saved) {
          setBtnStatus(prev => ({
            ...prev,
            "regularBookMark": false,
            "solidBookMark": true,
          }));
        }
      })
      .catch(error => console.log(error));
    setLoading(false);
  }

  return (
    <button
      disabled={loading}
      style={loading ? { opacity: ".5", cursor: "revert" } : {}}
      title="save recipe"
      onClick={saveRecipe}
    >
      {loading ?
        <RotatingLines
          strokeColor="gray"
          strokeWidth="5"
          animationDuration="0.75"
          width="20"
          visible={true}
        />
        : <i className="fa-regular fa-bookmark"></i>}
    </button>
  )
}

const UnSaveBtn = ({ userId, recipeId, setBtnStatus }) => {
  const { user, setUser } = useContext(portfolioContext) || {};
  const [loading, setLoading] = useState(false);

  const unSaveRecipe = async () => {
    setLoading(true);
    await axios.post(`${serverUrl}/recipes/unSaveRecipe`, {
      userId: userId,
      recipeId: recipeId
    })
      .then(res => {
        const { unSaved } = res.data;
        if (unSaved) {
          setBtnStatus(prev => ({
            ...prev,
            "regularBookMark": true,
            "solidBookMark": false,
          }));
          if (user?._id) {
            const savedRecipes = user.savedRecipes.filter(recipe =>
              recipe._id != recipeId);
            setUser(prev => ({ ...prev, "savedRecipes": savedRecipes }))
          }
        }
      })
      .catch(error => console.log(error));
    setLoading(false);
  }

  return (
    <button
      disabled={loading}
      style={loading ? { opacity: ".5", cursor: "revert" } : {}}
      className={style.unSave_btn}
      title="unSave recipe"
      onClick={unSaveRecipe}
    >
      {loading ?
        <RotatingLines
          strokeColor="gray"
          strokeWidth="5"
          animationDuration="0.75"
          width="20"
          visible={true}
        />
        : <i className="fa-solid fa-bookmark"></i>}
    </button>
  )
}

const RemoveBtn = ({ userId, recipeId }) => {
  const { user, setUser } = useContext(portfolioContext) || {};
  const [loading, setLoading] = useState(false);

  const removeCreatedRecipe = async () => {
    setLoading(true);
    await axios.post(`${serverUrl}/recipes/removeCreatedRecipe`, {
      userId: userId,
      recipeId: recipeId
    })
      .then(res => {
        const { removed } = res.data;
        if (removed && user?._id) {
          const createdRecipes = user.createdRecipes.filter(recipe =>
            recipe._id != recipeId);
          setUser(prev => ({ ...prev, "createdRecipes": createdRecipes }))
        }
      })
      .catch(error => console.log(error));
    setLoading(false);
  }

  return (
    <button
      disabled={loading}
      style={loading ? { opacity: ".5", cursor: "revert" } : {}}
      title="remove created recipe"
      onClick={removeCreatedRecipe}
    >
      {loading ?
        <RotatingLines
          strokeColor="gray"
          strokeWidth="5"
          animationDuration="0.75"
          width="20"
          visible={true}
        />
        : <i className="fa-solid fa-trash"></i>}
    </button>
  )
}

export default RecipeCard
