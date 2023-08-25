/* eslint-disable react/prop-types */
import { useContext } from "react";
import { RecipeCard } from "../../../components";
import { RotatingLines } from "react-loader-spinner";
import { PortfolioContext } from "../UserPortfolio";
import style from "./Recipes.module.css";

const Recipes = ({ recipes, setLimit, btnLoading, solidBookMark, trash }) => {
  const { range } = useContext(PortfolioContext);

  return (
    <>
      {
        recipes.length > 0 ?
          <div className={style.recipes}>
            {
              recipes.map(recipe =>
                recipe._id ?
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    solidBookMark={solidBookMark}
                    trash={trash}
                  />
                  : ""
              )
            }

            <button
              disabled={btnLoading}
              style={btnLoading ? { opacity: ".5", cursor: "revert" } : {}}
              onClick={() => setLimit(prev => prev + range)}
            >
              {
                btnLoading &&
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
            No Recipes Exist
          </div>
      }
    </>
  )
}

export default Recipes
