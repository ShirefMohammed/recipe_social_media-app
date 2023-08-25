import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GetServerUrl } from "../../hooks";
import { AppContext } from "../../App";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import style from "./Recipe.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const Recipe = () => {
  const { cookies, userId } = useContext(AppContext);
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState({});
  const [recipeNotFoundMsg, setRecipeNotFoundMsg] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const promise = await axios.get(`${serverUrl}/recipes/recipeId/${recipeId}`);
        setRecipe(promise.data.recipe)
      } catch {
        setRecipeNotFoundMsg("Recipe Not Found")
      }
    }

    fetchRecipe();
  }, [recipeId]);

  const saveRecipe = async () => {
    try {
      const promise = await axios.post(`${serverUrl}/recipes/saveRecipe`, {
        userId: userId,
        recipeId: recipe._id
      });
      if (promise.data.saved) {
        toast.success("recipe saved successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {recipe?._id ?
        <section className={style.recipe}>
          <div className={style.owner}>
            <Link to={`/users/${recipe.owner._id}`}>
              <img src={recipe.owner.picture} alt="owner picture" />
            </Link>
            <span> {recipe.owner.name} </span>
          </div>

          <img
            className={style.recipeImg}
            src={recipe.imageUrl}
            alt="recipe imageUrl"
          />

          <h2 className={style.recipe_title}>
            {recipe.title}
          </h2>

          <div className={style.ingredients}>
            <h3>
              <i className="fa-solid fa-angles-right"></i>
              Recipe Ingredients
            </h3>
            <ol>
              {
                recipe?.ingredients?.map((ingredient, index) => {
                  return <li key={index}>{ingredient}</li>
                })
              }
            </ol>
          </div>

          <div className={style.instructions}>
            <h3>
              <i className="fa-solid fa-angles-right"></i>
              Recipe Instructions
            </h3>
            <ol>
              {
                recipe?.instructions?.map((instruction, index) => {
                  return <li key={index}>{instruction}</li>
                })
              }
            </ol>
          </div>

          <div className={style.cooking_time}>
            <h3>
              <i className="fa-solid fa-angles-right"></i>
              Recipe Cooking Time
            </h3>
            <p>{recipe.cookingTime}</p>
          </div>

          {
            cookies.access_token &&
            <button
              className={`${style.save_recipe_btn} second_btn`}
              onClick={saveRecipe}
            >
              Save Recipe
              <i className="fa-regular fa-bookMark"></i>
            </button>
          }
        </section>

        : recipeNotFoundMsg ?
          <p className={style.not_found}>
            {recipeNotFoundMsg}
          </p>

          : <p className={style.spinner_container}>
            <RotatingLines
              strokeColor="gray"
              strokeWidth="5"
              animationDuration="0.75"
              width="40"
              visible={true}
            />
          </p>}
    </>
  )
}

export default Recipe
