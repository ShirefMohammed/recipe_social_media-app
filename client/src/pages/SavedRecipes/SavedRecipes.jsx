import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { GetUserId, GetServerAPI } from "../../hooks";
import { RecipeCard } from "../../components";

import style from "./SavedRecipes.module.css";
import axios from "axios";

const api = GetServerAPI();
const userId = GetUserId();

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    !cookies.access_token && navigate("*");
  }, [cookies, navigate]);

  useEffect(() => {
    axios.post(`${api}/recipes/savedRecipes`, {
      userId: userId
    }).then(res => setSavedRecipes(res.data.savedRecipes));
  }, []);

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
