/* eslint-disable react/prop-types */
import style from "./SideBar.module.css";

const SideBar = ({ leftColComp, setLeftColComp }) => {
  return (
    <ul className={style.sidebar}>
      <li>
        <button
          type="button"
          className={leftColComp === "CreatedRecipes" ? style.active : ""}
          onClick={() => setLeftColComp("CreatedRecipes")}
        >
          <span>created recipes</span>
          <i className="fa-solid fa-folder-plus"></i>
        </button>
      </li>

      <li>
        <button
          type="button"
          className={leftColComp === "SavedRecipes" ? style.active : ""}
          onClick={() => setLeftColComp("SavedRecipes")}
        >
          <span>saved recipes</span>
          <i className="fa-solid fa-bookmark"></i>
        </button>
      </li>

      <li>
        <button
          type="button"
          className={leftColComp === "Following" ? style.active : ""}
          onClick={() => setLeftColComp("Following")}
        >
          <span>users you follow</span>
          <i className="fa-solid fa-user"></i>
        </button>
      </li>

      <li>
        <button
          type="button"
          className={leftColComp === "Followers" ? style.active : ""}
          onClick={() => setLeftColComp("Followers")}
        >
          <span>users follow you</span>
          <i className="fa-solid fa-user"></i>
        </button>
      </li>

      <li>
        <button
          type="button"
          className={leftColComp === "Settings" ? style.active : ""}
          onClick={() => setLeftColComp("Settings")}
        >
          <span>settings</span>
          <i className="fa-solid fa-gear"></i>
        </button>
      </li>
    </ul>
  )
}

export default SideBar