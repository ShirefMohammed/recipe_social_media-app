import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetServerUrl } from "../../hooks";
import { RecipeCard } from "../../components";
import { appContext } from "../../App";
import style from "./SavedRecipes.module.css";
import axios from "axios";
const serverUrl = GetServerUrl();

const SavedRecipes = () => {
  const { userId, cookies } = useContext(appContext);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    !cookies.access_token && navigate("*");
  }, [cookies, navigate]);

  useEffect(() => {
    const getSavedRecipes = async () => {
      axios.post(`${serverUrl}/recipes/savedRecipes`, { userId: userId })
        .then(res => setSavedRecipes(res.data.savedRecipes))
        .catch(error => console.log(error));
    }
    getSavedRecipes();
  }, [userId]);

  return (
    <div className={style.saved_recipes}>
      {savedRecipes.length > 0 ?
        savedRecipes.map(recipe =>
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            setSavedRecipes={setSavedRecipes}
          />)
        : <p className={style.no_saved_recipes}>NO SAVED RECIPES</p>}
    </div>
  )
}

export default SavedRecipes
