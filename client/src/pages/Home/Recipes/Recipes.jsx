/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { RecipeCard } from "../../../components";
import { GetServerUrl } from "../../../hooks";
import { RotatingLines } from "react-loader-spinner";
import { AppContext } from "../../../App";
import style from "./Recipes.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();
const range = 5;

const Recipes = () => {
  const { userId, cookies } = useContext(AppContext);
  const [recipesLimit, setRecipesLimit] = useState(range);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        if (cookies.access_token && userId) {
          const promise = await axios.get(`${serverUrl}/recipes?excepted=${userId}&limit=${recipesLimit}`);
          setRecipes(promise.data.recipes);
        } else if (!cookies.access_token) {
          const promise = await axios.get(`${serverUrl}/recipes?excepted=none&limit=${recipesLimit}`);
          setRecipes(promise.data.recipes);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRecipes();
  }, [recipesLimit, userId, cookies]);


  return (
    <>
      {
        recipes?.length > 0 ?
          <div className={style.recipes}>
            {
              recipes.map(recipe =>
                recipe._id ?
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    regularBookMark={true}
                  />
                  : ""
              )
            }
            <button
              style={loading ? { opacity: ".5", cursor: "revert" } : {}}
              disabled={loading}
              onClick={() => setRecipesLimit(prev => prev + range)}
            >
              {
                loading &&
                <RotatingLines
                  strokeColor="#fff"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="20"
                  visible={true}
                />
              }
              load more
            </button>
          </div>

          : recipes?.length == 0 ?
            <div className={style.no_recipes_posted}>
              No Recipes Has Been Posted Yet
            </div>

            : <div className={style.spinner_container}>
              <RotatingLines
                strokeColor="gray"
                strokeWidth="5"
                animationDuration="0.75"
                width="40"
                visible={true}
              />
            </div>
      }
    </>
  )
}

export default Recipes
