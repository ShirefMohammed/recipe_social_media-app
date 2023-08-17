/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ConvertToBase64, GetServerUrl } from "../../hooks";
import { RecipeCard } from "../../components";
import { appContext } from "../../App";

import style from "./UserPortfolio.module.css";
import axios from "axios";
import { toast } from "react-toastify";

const serverUrl = GetServerUrl();

const UserPortfolio = () => {
  const { userId, cookies } = useContext(appContext);
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.access_token) {
      navigate("*");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    const getDate = async () => {
      if (!userId) return;
      axios.post(`${serverUrl}/recipes/createdRecipes`, { userId: userId })
        .then((res) => setCreatedRecipes(res.data.createdRecipes))
        .catch((error) => console.log(error));
    };
    getDate();
  }, [userId]);

  return (
    <section className={style.user_portfolio}>
      {/* User Details Section */}
      <div className={style.user_details}>
        <div className={style.account_bg_container}>
          <AccountBg />
        </div>
        <div className={style.user_picture_container}>
          <UserPicture />
        </div>
        <div className={style.about_user_container}>
          <AboutUser />
        </div>
      </div>

      {/* Created Recipes */}
      <div className={style.created_recipes}>
        {createdRecipes.length > 0
          ? createdRecipes.map((recipe) =>
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              setCreatedRecipes={setCreatedRecipes}
            />
          ) : ""}
      </div>

      {/* Right Column */}
      <div className={style.right_column}>
        {/* Settings */}
        <section className={style.settings}>
          <Settings />
        </section>
        {/* Suggested Users To Follow */}
        <div className={style.suggested_users}></div>
      </div>
    </section>
  );
};

const AccountBg = () => {
  const { userId, user, setUser } = useContext(appContext);

  const uploadAccountBg = async ({ target }) => {
    const accountBgFile = target.files[0];
    const base64Img = await ConvertToBase64(accountBgFile);
    axios
      .post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: userId,
        accountBg: base64Img,
      })
      .then((res) => setUser(res.data.user))
      .catch((error) => console.log(error));
  };

  return (
    <div className={style.account_bg}>
      <img src={user.accountBg} alt="accountBg" />

      <label htmlFor="accountBgFile" className="circle_btn">
        <i className="fa-solid fa-pen"></i>
      </label>

      <input
        type="file"
        id="accountBgFile"
        accept=".jpeg, .jpg,.png"
        onChange={uploadAccountBg}
      />
    </div>
  );
};

const UserPicture = () => {
  const { userId, user, setUser } = useContext(appContext);

  const uploadUserPicture = async ({ target }) => {
    const userPictureFile = target.files[0];
    const base64Img = await ConvertToBase64(userPictureFile);
    axios
      .post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: userId,
        picture: base64Img,
      })
      .then((res) => setUser(res.data.user))
      .catch((error) => console.log(error));
  };

  return (
    <div className={style.user_picture}>
      <img src={user.picture} alt="user picture" />

      <label htmlFor="userPictureFile" className="circle_btn">
        <i className="fa-solid fa-pen"></i>
      </label>

      <input
        type="file"
        id="userPictureFile"
        accept=".jpeg, .jpg,.png"
        onChange={uploadUserPicture}
      />
    </div>
  );
};

const AboutUser = () => {
  const { userId, user, setUser } = useContext(appContext);
  const [bioEditor, setBioEditor] = useState(false);
  const [bio, setBio] = useState();

  const ChangeBio = async (e) => {
    e.preventDefault();

    axios
      .post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: userId,
        bio: bio,
      })
      .then((res) => setUser(res.data.user))
      .catch((error) => console.log(error));

    setBioEditor(false);
  };

  return (
    <div className={style.about_user}>
      <h2 className={style.name}>{user.name}</h2>

      <div className={style.bio}>
        <span>{user.bio || "account has no bio"}</span>

        <button className="circle_btn" onClick={() => setBioEditor(true)}>
          <i className="fa-solid fa-pen"></i>
        </button>

        {bioEditor ? (
          <div className={style.editor}>
            <button
              className={`${style.close_editor_btn} circle_btn`}
              onClick={() => setBioEditor(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <form onSubmit={ChangeBio}>
              <h2>Change Bio</h2>

              <input
                type="text"
                placeholder="Enter Bio"
                onChange={(e) => setBio(e.target.value)}
                required
              />

              <button type="submit" className="first_btn">
                Change Bio
              </button>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const Settings = () => {
  const { userId, user, setCookies } = useContext(appContext);
  const [passEditor, setPassEditor] = useState(false);
  const [passFormInputs, setPassFormInputs] = useState({});
  const [deleteEditor, setDeleteEditor] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const navigate = useNavigate();

  // Handle Old Password And New Password Inputs Change
  const handlePassChange = (e) => {
    setPassFormInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Change Password When Submit Form
  const changePassword = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword } = passFormInputs;

    if (oldPassword === newPassword) {
      toast.error("enter strong password", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      axios
        .post(`${serverUrl}/users/userPortfolio/updateAccount`, {
          userId: userId,
          oldPassword: oldPassword,
          newPassword: newPassword,
        })
        .then((res) => {
          const { changed, message } = res.data;
          changed
            ? toast.success(message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            })
            : toast.error(message, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
        })
        .catch((error) => console.log(error));

      setPassEditor(false);
    }
  };

  // Delete User Account
  const deleteAccount = async (e) => {
    e.preventDefault();

    axios
      .post(`${serverUrl}/users/userPortfolio/deleteAccount`, {
        userId: userId,
        password: accountPassword,
      })
      .then((res) => {
        const { deleted, message } = res.data;
        if (deleted) {
          setCookies("access_token", "");
          localStorage.removeItem("userId");
          navigate("/");
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
        } else {
          toast.error(message, {
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
      })
      .catch((error) => console.log(error));

    setDeleteEditor(false);
  };

  return (
    <div className={style.account_settings}>
      {/* name */}
      <div className={style.name}>
        <p>
          name: <span>{user.name}</span>
        </p>
      </div>

      {/* email */}
      <div className={style.email}>
        <p>
          email: <span>{user.email}</span>
        </p>
      </div>

      {/* Change Password */}
      <div className={style.password}>
        <span>Password: **********</span>

        <button
          className={`${style.change_password_btn} circle_btn`}
          onClick={() => setPassEditor(true)}
        >
          <i className="fa-solid fa-pen"></i>
        </button>

        {passEditor ? (
          <div className={style.editor}>
            <button
              className={`${style.close_editor_btn} circle_btn`}
              onClick={() => setPassEditor(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <form onSubmit={changePassword}>
              <h2>Change Password</h2>

              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                onChange={handlePassChange}
                required
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                onChange={handlePassChange}
                required
              />

              <button type="submit" className="first_btn">
                Change Password
              </button>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* Delete Account */}
      <div className={style.delete_account}>
        <span>Delete Your Account:</span>

        <button
          className={`${style.delete_account_btn} circle_btn`}
          onClick={() => setDeleteEditor(true)}
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>

        {deleteEditor ? (
          <div className={style.editor}>
            <button
              className={`${style.close_editor_btn} circle_btn`}
              onClick={() => setDeleteEditor(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <form onSubmit={deleteAccount}>
              <h2>Delete Account</h2>

              <input
                type="password"
                name="accountPassword"
                placeholder="Enter Your Password"
                onChange={(e) => setAccountPassword(e.target.value)}
                required
              />

              <button type="submit" className="first_btn">
                Delete Account
              </button>
            </form>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default UserPortfolio;
