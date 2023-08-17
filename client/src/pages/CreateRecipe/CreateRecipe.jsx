/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { GetServerUrl, ConvertToBase64 } from "../../hooks";
import { appContext } from "../../App";


import style from "./CreateRecipe.module.css";
import whiteImg from "../../assets/whiteImg.png"
import axios from "axios";

const serverUrl = GetServerUrl();

const CreateRecipe = () => {
  const { userId, cookies } = useContext(appContext);
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: [],
    cookingTime: "",
    imageUrl: "",
    owner: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    !cookies.access_token && navigate("*");
  }, [cookies, navigate]);

  useEffect(() => {
    setRecipe(prev => ({ ...prev, "owner": userId }));
  }, [userId]);

  const handleChange = (e) => {
    setRecipe(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // create new recipe
  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      axios.post(`${serverUrl}/recipes/createNewRecipe`, { recipe: recipe })
        .then(res => {
          const { message } = res.data;
          toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    } catch (error) {
      console.log(error)
    }

    setRecipe({
      title: "",
      ingredients: [],
      instructions: [],
      cookingTime: "",
      imageUrl: "",
      owner: ""
    });
  }

  return (
    <section className={style.create_recipe}>
      <h2>Create Recipe</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="title"
          value={recipe.title}
          onChange={handleChange}
          required
        />

        <Ingredients recipe={recipe} setRecipe={setRecipe} />

        <Instructions recipe={recipe} setRecipe={setRecipe} />

        <input
          type="text"
          name="cookingTime"
          placeholder="cooking time"
          value={recipe.cookingTime}
          onChange={handleChange}
          required
        />

        <RecipeImage recipe={recipe} setRecipe={setRecipe} />

        <button
          type="submit"
          className="first_btn"
        >
          Create New Recipe
        </button>
      </form>
    </section>
  )
}

const Ingredients = ({ recipe, setRecipe }) => {
  const [newIngredient, setNewIngredient] = useState("");

  const addIngredient = () => {
    if (!newIngredient) return;

    setRecipe(prev => ({
      ...prev,
      "ingredients": [...recipe.ingredients, newIngredient]
    }));

    setNewIngredient("");
  }

  const removeIngredient = (index) => {
    recipe.ingredients = recipe.ingredients.filter((ingredient, idx) =>
      idx != index);

    setRecipe(prev => ({
      ...prev,
      "ingredients": recipe.ingredients
    }));
  }

  return (
    <>
      <div className="ingredients">
        <input
          type="text"
          placeholder="enter ingredients"
          required={recipe.ingredients.length > 0 ? false : true}
          value={newIngredient}
          onChange={e => setNewIngredient(e.target.value)}
        />

        <button
          type="button"
          className="circle_btn"
          onClick={addIngredient}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {recipe.ingredients.length > 0 ?
        <ol>
          {recipe.ingredients.map((ingredient, index) => {
            return <li key={index}>
              <div>
                <span>{ingredient}</span>
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}>
                  <i className="fa-solid fa-minus"></i>
                </button>
              </div>
            </li>
          })}
        </ol>
        : ""}
    </>
  )
}

const Instructions = ({ recipe, setRecipe }) => {
  const [newInstruction, setNewInstruction] = useState("");

  const addInstruction = () => {
    if (!newInstruction) return;

    setRecipe(prev => ({
      ...prev,
      "instructions": [...recipe.instructions, newInstruction]
    }));

    setNewInstruction("");
  }

  const removeInstruction = (index) => {
    recipe.instructions = recipe.instructions.filter((instruction, idx) =>
      idx != index);

    setRecipe(prev => ({
      ...prev,
      "instructions": recipe.instructions
    }));
  }

  return (
    <>
      <div className="instructions">
        <input
          type="text"
          placeholder="enter instructions"
          required={recipe.instructions.length > 0 ? false : true}
          value={newInstruction}
          onChange={e => setNewInstruction(e.target.value)}
        />

        <button
          type="button"
          className="circle_btn"
          onClick={addInstruction}
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {recipe.instructions.length > 0 ?
        <ol>
          {recipe.instructions.map((instruction, index) => {
            return <li key={index}>
              <div>
                <span>{instruction}</span>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}>
                  <i className="fa-solid fa-minus"></i>
                </button>
              </div>
            </li>
          })}
        </ol>
        : ""}
    </>
  )
}

const RecipeImage = ({ recipe, setRecipe }) => {
  const handleChange = (e) => {
    setRecipe(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleRecipeImg = async ({ target }) => {
    const recipeImgFile = target.files[0];

    const base64 = await ConvertToBase64(recipeImgFile);

    setRecipe(prev => ({ ...prev, "imageUrl": base64 }));
  }

  return (
    <>
      <div className={style.recipe_img}>
        <input
          type="text"
          name="imageUrl"
          placeholder="Recipe Image Url"
          value={recipe.imageUrl}
          onChange={handleChange}
          required
        />

        <label
          className="circle_btn"
          htmlFor="recipeImgFile"
          title="upload image from your device"
        >
          <i className="fa-solid fa-arrow-up-from-bracket"></i>
        </label>

        <input
          type="file"
          name="recipeImgFile"
          id="recipeImgFile"
          accept=".jpeg, .jpg,.png"
          onChange={handleRecipeImg}
        />
      </div>

      <div className={style.selected_img}>
        <img
          src={recipe.imageUrl || whiteImg}
          alt="image url is wrong"
        />
      </div>
    </>
  )
}

export default CreateRecipe
