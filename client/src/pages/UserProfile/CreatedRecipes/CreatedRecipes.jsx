/* eslint-disable react/prop-types */
import {useContext } from "react";
import { RecipeCard } from "../../../components";
import { RotatingLines } from "react-loader-spinner";
import { ProfileContext } from "../UserProfile";
import style from "./CreatedRecipes.module.css";

const CreatedRecipes = ({
  createdRecipes,
  setCreatedRecipesLimit,
  fetchLoading,
  regularBookMark
}) => {
  const { range } = useContext(ProfileContext);

  return (
    <>
      {
        createdRecipes.length > 0 ?
          <div className={style.created_recipes}>
            {
              createdRecipes.map(recipe =>
                recipe._id ?
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    regularBookMark={regularBookMark}
                  />
                  : ""
              )
            }

            <button
              disabled={fetchLoading}
              style={fetchLoading ? { opacity: ".5", cursor: "revert" } : {}}
              onClick={() => setCreatedRecipesLimit(prev => prev + range)}
            >
              {
                fetchLoading &&
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

          : <div className={style.no_recipes}>
            This user does not post any recipes
          </div>
      }
    </>
  )
}

export default CreatedRecipes
