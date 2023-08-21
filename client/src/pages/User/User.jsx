import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GetServerUrl } from "../../hooks";
import { RecipeCard } from "../../components";
import style from "./User.module.css";
import accountBgAlt from "../../assets/accountBgAlt.png";
import userPictureAlt from "../../assets/userPictureAlt.png";
import axios from "axios";
const serverUrl = GetServerUrl();

const User = () => {
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [userNotFoundMsg, setUserNotFoundMsg] = useState("");

  useEffect(() => {
    const getData = async () => {
      axios.get(`${serverUrl}/users/getUser/userId/${userId}`)
        .then(res => setUser(res.data.user))
        .catch(() => setUserNotFoundMsg("User Not Found"));
    }
    getData();
  }, [userId]);

  return (
    <>
      {user?._id ?
        <section className={style.user_account}>
          {/* User Details Section */}
          <section className={style.user_details}>
            <div className={style.account_bg}>
              <img src={user.accountBg || accountBgAlt} alt="accountBg" />
            </div>

            <div className={style.user_picture}>
              <img src={user.picture || userPictureAlt} alt="userAvatar" />
            </div>

            <div className={style.about_user}>
              <h2 className={style.name}>{user.name}</h2>
              <p className={style.bio}>{user.bio}</p>
            </div>
          </section>

          {/* Created Recipes */}
          <section className={style.created_recipes}>
            {user.createdRecipes.length > 0 ? user.createdRecipes.map(recipe =>
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                setCreatedRecipes={user.createdRecipes} />)
              : ""}
          </section>

          {/* Suggested Users To Follow */}
          <div className={style.suggested_users}>
          </div>
        </section>
        : userNotFoundMsg ?
          <p className={style.user_not_found}>{userNotFoundMsg}</p>
          : <p style={{ textAlign: "center" }}>loading ...</p>}
    </>
  )
}

export default User
