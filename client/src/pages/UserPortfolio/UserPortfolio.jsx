/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { GetServerUrl } from "../../hooks";
import { AppContext } from "../../App";
import { RotatingLines } from "react-loader-spinner";
import AccountBg from "./AccountBg/AccountBg";
import UserPicture from "./UserPicture/UserPicture";
import AboutUser from "./AboutUser/AboutUser";
import SideBar from "./SideBar/SideBar";
import Recipes from "./Recipes/Recipes";
import Users from "./Users/Users";
import Settings from "./Settings/Settings";
import style from "./UserPortfolio.module.css";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const PortfolioContext = createContext();

const serverUrl = GetServerUrl();
const range = 5;

const UserPortfolio = () => {
  const { userId, cookies } = useContext(AppContext);
  const [user, setUser] = useState({});
  const [leftColComp, setLeftColComp] = useState("CreatedRecipes");
  const [createdRecipesLimit, setCreatedRecipesLimit] = useState(range);
  const [savedRecipesLimit, setSavedRecipesLimit] = useState(range);
  const [followingStartIdx, setFollowingStartIdx] = useState(0);
  const [followingLimit] = useState(range);
  const [followersStartIdx, setFollowersStartIdx] = useState(0);
  const [followersLimit] = useState(range);
  const [btnLoading, setBtnLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    !cookies.access_token && navigate("*");
  }, [cookies, navigate]);

  const fetchUser = async () => {
    try {
      if (!userId) return;
      setBtnLoading(true);
      const promise = await axios.get(`${serverUrl}/users/getUser/userId/${userId}?fullData=true&createdRecipesLimit=${createdRecipesLimit}&savedRecipesLimit=${savedRecipesLimit}&followingStartIdx=${followingStartIdx}&followingLimit=${followingLimit}&followersStartIdx=${followersStartIdx}&followersLimit=${followersLimit}`);
      setUser(promise.data.user);
      setBtnLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userId,
    createdRecipesLimit,
    savedRecipesLimit,
    followingStartIdx,
    followersStartIdx
  ]);

  return (
    <>
      {
        user?._id ?
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
              <PortfolioContext.Provider value={{
                user,
                setUser,
                range,
                fetchUser
              }}>
                {
                  leftColComp == "CreatedRecipes" &&
                  <Recipes
                    recipes={user.createdRecipes}
                    setLimit={setCreatedRecipesLimit}
                    btnLoading={btnLoading}
                    trash={true}
                  />
                }
                {
                  leftColComp == "SavedRecipes" &&
                  <Recipes
                    recipes={user.savedRecipes}
                    setLimit={setSavedRecipesLimit}
                    btnLoading={btnLoading}
                    solidBookMark={true}
                  />
                }
                {
                  leftColComp == "Following" &&
                  <Users
                    users={user.following}
                    startIdx={followingStartIdx}
                    setStartIdx={setFollowingStartIdx}
                    btnLoading={btnLoading}
                    following={true}
                  />
                }
                {
                  leftColComp == "Followers" &&
                  <Users
                    users={user.followers}
                    startIdx={followersStartIdx}
                    setStartIdx={setFollowersStartIdx}
                    btnLoading={btnLoading}
                    followers={true}
                  />
                }
                {
                  leftColComp == "Settings" &&
                  <Settings />
                }
              </PortfolioContext.Provider>
            </section>

            {/* right column */}
            <section className={style.right_column}>
              <SideBar
                leftColComp={leftColComp}
                setLeftColComp={setLeftColComp}
              />
            </section>
          </section>

          : <div className={style.spinner_container}>
            <RotatingLines
              strokeColor="gray"
              strokeWidth="5"
              animationDuration="0.75"
              width="40"
              visible={true}
            />
          </div>
      }
    </>
  )
};


export default UserPortfolio;
