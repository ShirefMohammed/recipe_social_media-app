import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecipeCard } from "../../components";
import { appContext } from "../../App";
import style from "./SavedRecipes.module.css";

const SavedRecipes = () => {
  const { user, cookies } = useContext(appContext);
  const navigate = useNavigate();

  useEffect(() => {
    !cookies.access_token && navigate("*");
  }, [cookies, navigate]);

  return (
    <div className={style.saved_recipes}>
      {user?.savedRecipes?.length > 0 ?
        user.savedRecipes.map(recipe =>
          <RecipeCard key={recipe._id} recipe={recipe} />)
        : user?.savedRecipes?.length == 0 ?
          <p className={style.no_saved_recipes}>NO SAVED RECIPES</p>
          : <p style={{ textAlign: "center" }}>loading ...</p>}
    </div>
  )
}

export default SavedRecipes
