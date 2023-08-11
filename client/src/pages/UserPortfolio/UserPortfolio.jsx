import { useState, useEffect, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ConvertToBase64, GetServerAPI, GetUserId } from "../../hooks";
import { RecipeCard } from "../../components";

import style from "./UserPortfolio.module.css";
import accountBgAlt from "../../assets/accountBgAlt.png";
import userAvatarAlt from "../../assets/userAvatarAlt.png";
import axios from "axios";

const api = GetServerAPI();
const userId = GetUserId();
const userContext = createContext();

// User Account Or User Portfolio
const UserPortfolio = () => {
  const [user, setUser] = useState({});
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    !cookies.access_token ? navigate("*")
      : (axios.post(`${api}/users/getUser/`, { userId: userId })
        .then(res => setUser(res.data.user)),
        axios.post(`${api}/recipes/createdRecipes`, { userId: userId })
          .then(res => setCreatedRecipes(res.data.createdRecipes)));
  }, [cookies, navigate]);

  return (
    <>
      <section className={style.user_account}>
        {/* User Details Section */}
        <section className={style.user_details}>
          <userContext.Provider value={{ user, setUser }}>
            <div className={style.accountBg}>
              <AccountBg />
            </div>

            <div className={style.userAvatar}>
              <UserAvatar />
            </div>

            <div className={style.aboutUser}>
              <AboutUser />
            </div>
          </userContext.Provider>
        </section>

        {/* Created Recipes */}
        <section className={style.created_recipes}>
          {createdRecipes.length > 0 ? createdRecipes.map(recipe =>
            <RecipeCard key={recipe._id} recipe={recipe} />)
            : ""}
        </section>

        {/* Right Column */}
        <section className={style.right_column}>
          {/* Settings */}
          <section className={style.settings}>
            <userContext.Provider value={{ user, setUser }}>
              <Settings />
            </userContext.Provider>
          </section>

          {/* Suggested Users To Follow */}
          <section className={style.suggested_users}>
          </section>
        </section>
      </section>

    </>
  )
}

const AccountBg = () => {
  const { user, setUser } = useContext(userContext);

  // uploadImage Function
  const uploadAccountBg = async ({ target }) => {
    const imgFile = target.files[0];
    const base64Img = await ConvertToBase64(imgFile);
    axios.post(`${api}/users/userPortfolio/updateAccount`, {
      userId: userId,
      accountBg: base64Img
    }).then(res => setUser(res.data.user));
  }

  return (
    <div className={style.upload_accountBg}>
      <img
        src={user.accountBg || accountBgAlt}
        alt="accountBg" />
      <label
        htmlFor="accountBgFile"
        className={`${style.upload_accountBg_btn} circle_btn`}>
        <i className="fa-solid fa-pen"></i>
      </label>
      <input
        type="file"
        id="accountBgFile"
        accept=".jpeg, .jpg,.png"
        onChange={uploadAccountBg} />
    </div>
  )
}

const UserAvatar = () => {
  const { user, setUser } = useContext(userContext);

  // uploadImage Function
  const uploadUserAvatar = async ({ target }) => {
    const imgFile = target.files[0];
    const base64Img = await ConvertToBase64(imgFile);
    axios.post(`${api}/users/userPortfolio/updateAccount`, {
      userId: userId,
      userAvatar: base64Img
    }).then(res => setUser(res.data.user));
  }

  return (
    <div className={style.upload_userAvatar}>
      <img
        src={user.userAvatar || userAvatarAlt}
        alt="userAvatar" />
      <label
        htmlFor="userAvatarFile"
        className={`${style.upload_userAvatar_btn} circle_btn`}>
        <i className="fa-solid fa-pen"></i>
      </label>
      <input
        type="file"
        id="userAvatarFile"
        accept=".jpeg, .jpg,.png"
        onChange={uploadUserAvatar} />
    </div>
  )
}

const AboutUser = () => {
  const { user, setUser } = useContext(userContext);
  const [bioEditor, setBioEditor] = useState(false);
  const [bio, setBio] = useState();

  const ChangeBio = (e) => {
    e.preventDefault();

    axios.post(`${api}/users/userPortfolio/updateAccount`, {
      userId: userId,
      bio: bio
    }).then(res => setUser(res.data.user));

    setBioEditor(false);
  }

  return (
    <div className={style.about_user}>
      <h2 className={style.username}>{user.username}</h2>

      <div className={style.bio}>
        <span>{user.bio || "Account Has No Bio"}</span>

        <button
          className={`${style.change_bio_btn} circle_btn`}
          onClick={() => setBioEditor(true)}>
          <i className="fa-solid fa-pen"></i>
        </button>

        {bioEditor ?
          <div className={style.editor}>
            <button
              className={`${style.close_editor_btn} circle_btn`}
              onClick={() => setBioEditor(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <form onSubmit={ChangeBio}>
              <h2>Change Bio</h2>

              <input
                type="text"
                placeholder="Enter Bio"
                onChange={e => setBio(e.target.value)}
                required />

              <button type="submit">Change Password</button>
            </form>
          </div>
          : ""}
      </div>
    </div>
  )
}

const Settings = () => {
  const { user } = useContext(userContext);
  const [passEditor, setPassEditor] = useState(false);
  const [passFormInputs, setPassFormInputs] = useState({});
  const [deleteEditor, setDeleteEditor] = useState(false);
  const [accountPassword, setAccountPassword] = useState();
  const [, setCookies] = useCookies(["access_token"]);

  // Handle Old Password And New Password Inputs Change
  const handlePassChange = ({ target }) => {
    setPassFormInputs(prev => ({ ...prev, [target.name]: target.value }));
  }

  // Change Password When Submit Form
  const ChangePassword = (e) => {
    e.preventDefault();

    const { oldPassword, newPassword } = passFormInputs;

    oldPassword === newPassword ?
      window.alert("New Password Must be Different Than Old Password")
      : axios.post(`${api}/users/userPortfolio/updateAccount`, {
        userId: userId,
        oldPassword: oldPassword,
        newPassword: newPassword
      }).then(res => alert(res.data.message));

    setPassEditor(false);
  }

  // Delete User Account 
  const deleteAccount = (e) => {
    e.preventDefault();

    axios.post(`${api}/users/userPortfolio/deleteAccount`, {
      userId: userId,
      password: accountPassword
    }).then(res => {
      const { accountDeleted, message } = res.data;
      !accountDeleted ? alert(message) : (logOut(), alert(message));
    });

    setDeleteEditor(false);
  };

  // Log Out When Deleting User Account
  const logOut = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userId");
    window.location.href = "/sign/signUp";
  }

  return (
    <div className={style.account_settings}>
      {/* Username */}
      <div className={style.username}>
        <p>Username: {user.username}</p>
      </div>

      {/* Change Password */}
      <div className={style.password}>
        <span>Password: **********</span>

        <button
          className={`${style.change_password_btn} circle_btn`}
          onClick={() => setPassEditor(true)}>
          <i className="fa-solid fa-pen"></i>
        </button>

        {passEditor ?
          <div className={style.editor}>
            <button
              className={`${style.close_editor_btn} circle_btn`}
              onClick={() => setPassEditor(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <form onSubmit={ChangePassword}>
              <h2>Change Password</h2>
              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                onChange={handlePassChange}
                required />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                onChange={handlePassChange}
                required />
              <button type="submit">Change Password</button>
            </form>
          </div>
          : ""}
      </div>

      {/* Delete Account */}
      <div className={style.delete_account}>
        <span>Delete Your Account:</span>

        <button
          className={`${style.delete_account_btn} circle_btn`}
          onClick={() => setDeleteEditor(true)}>
          <i className="fa-solid fa-trash-can"></i>
        </button>

        {deleteEditor ?
          <div className={style.editor}>
            <button
              className={`${style.close_editor_btn} circle_btn`}
              onClick={() => setDeleteEditor(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            <form onSubmit={deleteAccount}>
              <h2>Delete Account</h2>
              <input
                type="password"
                name="accountPassword"
                placeholder="Enter Your Password"
                onChange={e => setAccountPassword(e.target.value)}
                required />
              <button type="submit">Delete Account</button>
            </form>
          </div>
          : ""}
      </div>
    </div>
  )
}

export default UserPortfolio
