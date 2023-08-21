/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { RecipeCard } from "../../components";
import { GetServerUrl } from "../../hooks";
import { RotatingLines } from "react-loader-spinner";
import { UserCard, SuggestedUsers } from "../../components";
import { appContext } from "../../App";
import style from "./Home.module.css";
import axios from "axios";
const serverUrl = GetServerUrl();

const Home = () => {
  const { user } = useContext(appContext);

  return (
    <section className={`container ${style.home}`}>
      <section className={style.user_card_container}>
        {user._id ? <UserCard user={user} /> : ""}
      </section>

      <Recipes />

      <section className={style.suggested_users_container}>
        {user._id ? <SuggestedUsers /> : ""}
      </section>
    </section>
  )
}

const Recipes = () => {
  const { userId, cookies } = useContext(appContext);
  const [recipesLimit, setRecipesLimit] = useState(2);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState();

  useEffect(() => {
    const getRecipes = async () => {
      setLoading(true);

      if (cookies.access_token && userId) {
        await axios.get(`${serverUrl}/recipes?excepted=${userId}&limit=${recipesLimit}`)
          .then(res => setRecipes(res.data.recipes))
          .catch(error => console.log(error));
      }

      if (!cookies.access_token) {
        await axios.get(`${serverUrl}/recipes?excepted=none&limit=${recipesLimit}`)
          .then(res => setRecipes(res.data.recipes))
          .catch(error => console.log(error));
      }

      setLoading(false);
    }
    getRecipes();
  }, [recipesLimit, userId, cookies]);


  return (
    <>
      {
        // if recipes exist
        recipes?.length > 0 ?
          <section className={style.recipes_container}>
            {recipes.map(recipe =>
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                regularBookMark={true}
              />
            )}
            <button
              style={loading ? { opacity: ".5", cursor: "revert" } : {}}
              className={style.loading_btn}
              disabled={loading}
              onClick={() => setRecipesLimit(prev => prev + 2)}
            >
              {loading &&
                <RotatingLines
                  strokeColor="#fff"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="20"
                  visible={true}
                />}
              load more
            </button>
          </section>

          // if recipes not exist
          : recipes?.length == 0 ?
            <div className={style.no_recipes_posted}>
              No Recipes Has Been Posted Yet
            </div>

            // if recipes loading
            : <div className={style.spinner_container}>
              {/* spinner */}
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

export default Home
