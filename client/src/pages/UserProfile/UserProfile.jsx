/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, createContext } from "react";
import { useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { GetServerUrl } from "../../hooks";
import { AppContext } from "../../App";
import CreatedRecipes from "./CreatedRecipes/CreatedRecipes";
import Connections from "./Connections/Connections";
import FollowBtn from "./FollowBtn/FollowBtn";
import style from "./UserProfile.module.css";
import axios from "axios";

export const ProfileContext = createContext();

const serverUrl = GetServerUrl();
const range = 5;

const UserProfile = () => {
  const { userId, cookies } = useContext(AppContext);
  const params = useParams();
  const [profileUserId, setProfileUserId] = useState("");
  const [user, setUser] = useState({});
  const [userNotFoundMsg, setUserNotFoundMsg] = useState("");
  const [createdRecipesLimit, setCreatedRecipesLimit] = useState(range);
  const [followingLimit, setFollowingLimit] = useState(range);
  const [followersLimit, setFollowersLimit] = useState(range);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    setProfileUserId(params.userId);
    setUser({});
  }, [params]);

  const fetchUser = async () => {
    try {
      if (!profileUserId) return;
      setFetchLoading(true);
      const promise = await axios.get(`${serverUrl}/users/getUser/userId/${profileUserId}?fullData=true&createdRecipesLimit=${createdRecipesLimit}&followingLimit=${followingLimit}&followersLimit=${followersLimit}`);
      setUser(promise.data.user);
      setFetchLoading(false);
    } catch {
      setUserNotFoundMsg("User Not Found");
    }
  }

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    profileUserId,
    createdRecipesLimit,
    followingLimit,
    followersLimit
  ]);

  return (
    <>
      {user?._id ?
        <section className={style.user_account}>
          <section className={style.user_details}>
            <div className={style.account_bg}>
              <img src={user.accountBg} alt="accountBg" />
            </div>

            <div className={style.user_picture}>
              <img src={user.picture} alt="userAvatar" />
            </div>

            <div className={style.about_user}>
              <h2 className={style.name}>{user.name}</h2>
              <p className={style.bio}>{user.bio}</p>
              {
                cookies.access_token &&
                profileUserId !== userId &&
                <FollowBtn userFollowedId={user._id} />
              }
            </div>
          </section>

          <ProfileContext.Provider value={{ fetchUser, range }}>
            <section className={style.created_recipes_container}>
              <CreatedRecipes
                createdRecipes={user.createdRecipes}
                setCreatedRecipesLimit={setCreatedRecipesLimit}
                fetchLoading={fetchLoading}
                regularBookMark={true}
              />
            </section>
          </ProfileContext.Provider>

          <ProfileContext.Provider value={{ fetchUser, range }}>
            <div className={style.right_column}>
              <div className={style.following}>
                <h2>He Follows</h2>
                <Connections
                  users={user.following}
                  setLimit={setFollowingLimit}
                  fetchLoading={fetchLoading}
                />
              </div>

              <div className={style.followers}>
                <h2>His Followers</h2>
                <Connections
                  users={user.followers}
                  setLimit={setFollowersLimit}
                  fetchLoading={fetchLoading}
                />
              </div>
            </div>
          </ProfileContext.Provider>
        </section>

        : userNotFoundMsg ?
          <p className={style.user_not_found}>
            {userNotFoundMsg}
          </p>

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
}

export default UserProfile
