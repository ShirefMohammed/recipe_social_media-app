import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { GetServerUrl } from "../../hooks";
import { RecipeCard } from "../../components";

import style from "./User.module.css";
import accountBgAlt from "../../assets/accountBgAlt.png";
import userAvatarAlt from "../../assets/userPictureAlt.png";
import axios from "axios";

const serverUrl = GetServerUrl();

const User = () => {
  const [user, setUser] = useState({});
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const { username } = useParams();
  const location = useLocation();

  useEffect(() => {
    axios.post(`${serverUrl}/users/getUser`, { username: username })
      .then(res => setUser(res.data.user));
    axios.post(`${serverUrl}/recipes/createdRecipes`, { username: username })
      .then(res => setCreatedRecipes(res.data.createdRecipes));
  }, [username, location]);

  return (
    <>
      {user ?
        <section className={style.user_account}>
          {/* User Details Section */}
          <section className={style.user_details}>
            <div className={style.account_bg}>
              <img src={user.accountBg || accountBgAlt} alt="accountBg" />
            </div>

            <div className={style.userAvatar}>
              <img src={user.userAvatar || userAvatarAlt} alt="userAvatar" />
            </div>

            <div className={style.details}>
              <h2 className={style.username}>{user.username}</h2>
              <p className={style.bio}>{user.bio}</p>
            </div>
          </section>

          {/* Created Recipes */}
          <section className={style.created_recipes}>
            {createdRecipes.length > 0 ? createdRecipes.map(recipe =>
              <RecipeCard key={recipe._id} recipe={recipe} />)
              : ""}
          </section>

          {/* Suggested Users To Follow */}
          <div className={style.suggested_users}>
          </div>
        </section>
        : <p className={style.user_not_found}>User Not Found</p>}
    </>
  )
}

export default User
