import { useEffect, useState } from "react";
import { RecipeCard } from "../../components";
import { GetServerUrl } from "../../hooks";

import style from "./Home.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const Home = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get(`${serverUrl}/recipes`).then(res => setRecipes(res.data.recipes));
  }, []);

  return (
    <div className={style.home}>
      {recipes.length > 0 ? recipes.map(recipe =>
        <RecipeCard key={recipe._id} recipe={recipe} />)
        : <p className={style.no_recipes}>No Recipes Has Been Posted Yet</p>}
    </div>
  )
}

export default Home
