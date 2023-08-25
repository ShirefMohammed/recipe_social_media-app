/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { GetServerUrl } from "../../hooks";
import { AppContext } from "../../App";
import style from "./SuggestedUsers.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const SuggestedUsers = () => {
  const { userId } = useContext(AppContext);
  const [suggestedUsers, setSuggestedUsers] = useState();
  const [suggestedUsersLimit] = useState(8);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        if (!userId) return;
        const promise = await axios.get(`${serverUrl}/users/getSuggestedUsers?userId=${userId}&&limit=${suggestedUsersLimit}`);
        setSuggestedUsers(promise.data.suggestedUsers);
      } catch (error) {
        console.log(error);
      }
    }

    fetchSuggestedUsers();
  }, [suggestedUsersLimit, userId]);

  return (
    <div className={style.suggested_users}>
      {
        suggestedUsers?.length > 0 ?
          <>
            <h2>Suggested Users</h2>
            {
              suggestedUsers.map(user => {
                return <UserCard key={user._id} user={user} />
              })
            }
          </>

          : suggestedUsers?.length == 0 ?
            <p className={style.no_suggested_users}>
              Suggested Users Will appear Here
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
    </div>
  )
}

const UserCard = ({ user }) => {
  const { userId } = useContext(AppContext);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const followUser = async () => {
    try {
      setLoading(true);
      const promise = await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, { userId: userId, userFollowedId: user._id });
      promise.data.followed && setIsFollowed(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const unFollowUser = async () => {
    try {
      setLoading(true);
      const promise = await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, { userId: userId, userUnFollowedId: user._id });
      promise.data.unFollowed && setIsFollowed(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={style.user_card}>
      <div className={style.left_side}>
        <img
          src={user.picture}
          alt="user picture"
        />
      </div>

      <div className={style.right_side}>
        <Link to={`/users/${user._id}`}>
          {user.name}
        </Link>

        <p>
          {user.bio}
        </p>

        <button
          disabled={loading}
          style={loading ? { opacity: ".5", cursor: "revert" } : {}}
          className={isFollowed ? style.unFollow : style.follow}
          onClick={isFollowed ? unFollowUser : followUser}
        >
          {
            isFollowed ?
              <>
                {
                  loading &&
                  <RotatingLines
                    strokeColor="gray"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="15"
                    visible={true}
                  />
                }
                unfollow
              </>
              : <>
                {
                  loading &&
                  <RotatingLines
                    strokeColor="gray"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="15"
                    visible={true}
                  />
                }
                follow
              </>
          }
        </button>
      </div>
    </div>
  )
}

export default SuggestedUsers
