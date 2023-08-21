/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, createContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ConvertToBase64, GetServerUrl } from "../../hooks";
import { RecipeCard } from "../../components";
import { appContext } from "../../App";
import { toast } from "react-toastify";
import { RotatingLines } from "react-loader-spinner";
import accountBgAlt from "../../assets/accountBgAlt.png";
import style from "./UserPortfolio.module.css";
import axios from "axios";
// eslint-disable-next-line react-refresh/only-export-components
export const portfolioContext = createContext();
const serverUrl = GetServerUrl();

const UserPortfolio = () => {
  const { userId, cookies } = useContext(appContext);
  const [user, setUser] = useState();
  const [leftColComp, setLeftColComp] = useState("CreatedRecipes");
  const [createdRecipesLimit, setCreatedRecipesLimit] = useState(2);
  const [savedRecipesLimit, setSavedRecipesLimit] = useState(2);
  const [followingStartIdx, setFollowingStartIdx] = useState(0);
  const [followingLimit, setFollowingLimit] = useState(2);
  const [followersStartIdx, setFollowersStartIdx] = useState(0);
  const [followersLimit, setFollowersLimit] = useState(2);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookies.access_token) {
      navigate("*");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    const getUserData = async () => {
      if (!userId) return;
      setBtnLoading(true);
      await axios.get(`${serverUrl}/users/getUser/userId/${userId}?fullData=true&createdRecipesLimit=${createdRecipesLimit}&savedRecipesLimit=${savedRecipesLimit}&followingStartIdx=${followingStartIdx}&followingLimit=${followingLimit}&followersStartIdx=${followersStartIdx}&followersLimit=${followersLimit}`)
        .then(res => setUser(res.data.user))
        .catch(error => console.log(error));
      setBtnLoading(false);
    }
    getUserData();
  }, [
    userId,
    createdRecipesLimit,
    savedRecipesLimit,
    followingStartIdx,
    followingLimit,
    followersStartIdx,
    followersLimit
  ]);

  return (
    <>
      {user?._id ?
        <section className={style.user_portfolio}>
          {/* user details */}
          <section className={style.user_details}>
            <div className={style.account_bg_container}>
              <AccountBg
                user={user}
                setUser={setUser}
              />
            </div>

            <div className={style.user_picture_container}>
              <UserPicture
                user={user}
                setUser={setUser}
              />
            </div>

            <div className={style.about_user_container}>
              <AboutUser
                user={user}
                setUser={setUser}
              />
            </div>
          </section>

          {/* left column */}
          <section className={style.left_column}>
            {
              leftColComp == "CreatedRecipes" &&
              <portfolioContext.Provider value={{ user, setUser }}>
                <Recipes
                  recipes={user.createdRecipes}
                  setLimit={setCreatedRecipesLimit}
                  btnLoading={btnLoading}
                  trash={true}
                />
              </portfolioContext.Provider>
            }
            {
              leftColComp == "SavedRecipes" &&
              <portfolioContext.Provider value={{ user, setUser }}>
                <Recipes
                  recipes={user.savedRecipes}
                  setLimit={setSavedRecipesLimit}
                  btnLoading={btnLoading}
                  solidBookMark={true}
                />
              </portfolioContext.Provider>
            }
            {
              leftColComp == "Following" &&
              <portfolioContext.Provider value={{ user, setUser }}>
                <Users
                  users={user.following}
                  setStartIdx={setFollowingStartIdx}
                  startIdx={followingStartIdx}
                  setLimit={setFollowingLimit}
                  btnLoading={btnLoading}
                  following={true}
                />
              </portfolioContext.Provider>
            }
            {
              leftColComp == "Followers" &&
              <portfolioContext.Provider value={{ user, setUser }}>
                <Users
                  users={user.followers}
                  setStartIdx={setFollowersStartIdx}
                  startIdx={followersStartIdx}
                  setLimit={setFollowersLimit}
                  btnLoading={btnLoading}
                  followers={true}
                />
              </portfolioContext.Provider>
            }
            {
              leftColComp == "Settings" &&
              <Settings user={user} />
            }
          </section>

          {/* right column */}
          <section className={style.right_column}>
            <SideBar
              leftColComp={leftColComp}
              setLeftColComp={setLeftColComp}
            />
          </section>
        </section>

        // if user data loading
        : <div className={style.spinner_container}>
          <RotatingLines
            strokeColor="gray"
            strokeWidth="5"
            animationDuration="0.75"
            width="40"
            visible={true}
          />
        </div>}
    </>
  )
};

const AccountBg = ({ user, setUser }) => {
  const uploadAccountBg = async ({ target }) => {
    const accountBgFile = target.files[0];
    const base64Img = await ConvertToBase64(accountBgFile);
    axios
      .post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: user._id,
        accountBg: base64Img,
      })
      .then((res) => setUser(res.data.user))
      .catch((error) => console.log(error));
  };

  return (
    <div className={style.account_bg}>
      <img src={user.accountBg || accountBgAlt} alt="accountBg" />

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

const UserPicture = ({ user, setUser }) => {
  const uploadUserPicture = async ({ target }) => {
    const userPictureFile = target.files[0];
    const base64Img = await ConvertToBase64(userPictureFile);
    axios
      .post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: user._id,
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

const AboutUser = ({ user, setUser }) => {
  const [bioEditor, setBioEditor] = useState(false);
  const [bio, setBio] = useState();

  const ChangeBio = async (e) => {
    e.preventDefault();

    axios
      .post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: user._id,
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

const SideBar = ({ leftColComp, setLeftColComp }) => {
  return (
    <ul className={style.sidebar}>
      <li>
        <button
          type="button"
          className={leftColComp == "CreatedRecipes" ? style.active : ""}
          onClick={() => setLeftColComp("CreatedRecipes")}
        >
          <span>created recipes</span>
          <i className="fa-solid fa-folder-plus"></i>
        </button>
      </li>
      <li>
        <button
          type="button"
          className={leftColComp == "SavedRecipes" ? style.active : ""}
          onClick={() => setLeftColComp("SavedRecipes")}
        >
          <span>saved recipes</span>
          <i className="fa-solid fa-bookmark"></i>
        </button>
      </li>
      <li>
        <button
          type="button"
          className={leftColComp == "Following" ? style.active : ""}
          onClick={() => setLeftColComp("Following")}
        >
          <span>users you follow</span>
          <i className="fa-solid fa-user"></i>
        </button>
      </li>
      <li>
        <button
          type="button"
          className={leftColComp == "Followers" ? style.active : ""}
          onClick={() => setLeftColComp("Followers")}
        >
          <span>users follow you</span>
          <i className="fa-solid fa-user"></i>
        </button>
      </li>
      <li>
        <button
          type="button"
          className={leftColComp == "Settings" ? style.active : ""}
          onClick={() => setLeftColComp("Settings")}
        >
          <span>settings</span>
          <i className="fa-solid fa-gear"></i>
        </button>
      </li>
    </ul>
  )
}

const Recipes = ({ recipes, setLimit, btnLoading, solidBookMark, trash }) => {
  return (
    <>
      {
        // if recipes exist
        recipes?.length > 0 ?
          <div className={style.recipes_container}>
            {recipes.map(recipe =>
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                solidBookMark={solidBookMark}
                trash={trash}
              />
            )}
            <button
              style={btnLoading ? { opacity: ".5", cursor: "revert" } : {}}
              className={style.loading_btn}
              disabled={btnLoading}
              onClick={() => setLimit(prev => prev + 2)}
            >
              {btnLoading &&
                <RotatingLines
                  strokeColor="#fff"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="20"
                  visible={true}
                />}
              load more
            </button>
          </div>

          // if recipes empty
          : <div className={style.no_recipes_exist}>
            No Recipes Exist
          </div>
      }
    </>
  )
}

const Users = ({
  users,
  startIdx,
  setStartIdx,
  setLimit,
  btnLoading,
  following,
  followers
}) => {
  return (
    <>
      {
        // if recipes exist
        users?.length > 0 ?
          // users container
          <div className={style.users_container}>
            <div className={style.users}>
              {users.map(user =>
                <UserCard
                  key={user._id}
                  user={user}
                  following={following}
                  followers={followers}
                />
              )}
            </div>

            {/* pagination */}
            <div className={style.pagination}>
              <button
                disabled={btnLoading || startIdx == 0 ? true : false}
                style={btnLoading || startIdx == 0 ? { cursor: "revert" } : {}}
                onClick={() => {
                  if (startIdx > 0) {
                    setStartIdx(prev => prev - 2)
                    setLimit(prev => prev - 2)
                  }
                }}
              >
                <i className="fa-solid fa-angles-left"></i>
                prev
              </button>

              <span className={style.page_number}>
                {btnLoading ?
                  <RotatingLines
                    strokeColor="gray"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="20"
                    visible={true}
                  />
                  : startIdx / 2 + 1}
              </span>

              <button
                disabled={btnLoading}
                style={btnLoading ? { cursor: "revert" } : {}}
                onClick={() => {
                  setStartIdx(prev => prev + 2)
                  setLimit(prev => prev + 2)
                }}
              >
                next
                <i className="fa-solid fa-angles-right"></i>
              </button>
            </div>
          </div>

          // if users empty
          : <div className={style.no_users}>
            No Users Exist
          </div>
      }
    </>
  )
}

const UserCard = ({ user, following, followers }) => {
  const { userId } = useContext(appContext);
  const { setUser } = useContext(portfolioContext);
  const [isFollowed, setIsFollowed] = useState(following ? true
    : followers ? false : false);
  const [loading, setLoading] = useState(false);

  const followUser = async () => {
    setLoading(true);
    await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, {
      userId: userId,
      userFollowedId: user._id
    })
      .then(res => {
        const { followed } = res.data;
        if (followed) {
          setIsFollowed(true);
          const followers = user.followers.filter(follower =>
            follower._id != user._id)
          const following = user.following.push(user);
          setUser(prev => ({
            ...prev,
            "following": following,
            "followers": followers
          }));
        }
      })
      .catch(error => console.log(error));
    setLoading(false);
  }

  const unFollowUser = async () => {
    setLoading(true);
    await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, {
      userId: userId,
      userUnFollowedId: user._id
    })
      .then(res => {
        const { unFollowed } = res.data;
        if (unFollowed) {
          setIsFollowed(false);
          const following = user.following.filter(followed =>
            followed._id != user._id)
          setUser(prev => ({ ...prev, "following": following }));
        }
      })
      .catch(error => console.log(error));
    setLoading(false);
  }

  return (
    <div className={style.user_card}>
      <img
        src={user.picture}
        alt="user picture"
      />

      <div className={style.middle_side}>
        <Link to={`/users/${user._id}`}>
          {user.name}
        </Link>

        <p>
          {user.bio}
        </p>
      </div>

      <button
        disabled={loading}
        style={loading ? { opacity: ".5", cursor: "revert" } : {}}
        className={isFollowed ? style.unFollow : style.follow}
        onClick={isFollowed ? unFollowUser : followUser}
      >
        {isFollowed ?
          <>
            {loading &&
              <RotatingLines
                strokeColor="gray"
                strokeWidth="5"
                animationDuration="0.75"
                width="15"
                visible={true}
              />}
            unFollow
          </>
          : <>
            {loading &&
              <RotatingLines
                strokeColor="gray"
                strokeWidth="5"
                animationDuration="0.75"
                width="15"
                visible={true}
              />}
            follow
          </>}
      </button>
    </div>
  )
}

const Settings = ({ user }) => {
  const { setCookies } = useContext(appContext);
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
          userId: user._id,
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
        userId: user._id,
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
