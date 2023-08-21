/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { GetServerUrl } from "../../hooks";
import { appContext } from "../../App";
import style from "./SuggestedUsers.module.css";
import axios from "axios";
const serverUrl = GetServerUrl();

const SuggestedUsers = () => {
  const { userId } = useContext(appContext);
  const [suggestedUsers, setSuggestedUsers] = useState();
  const [suggestedUsersLimit] = useState(8);

  useEffect(() => {
    const getSuggestedUsers = async () => {
      if (!userId) return;
      await axios.get(`${serverUrl}/users/getSuggestedUsers?userId=${userId}&&limit=${suggestedUsersLimit}`)
        .then(res => setSuggestedUsers(res.data.suggestedUsers))
        .catch(error => console.log(error));
    }
    getSuggestedUsers();
  }, [suggestedUsersLimit, userId]);

  return (
    <div className={style.suggested_users}>
      {
        // if suggested users exist
        suggestedUsers?.length > 0 ?
          <>
            <h2>suggested users</h2>
            {suggestedUsers.map(user => {
              return <SuggestedUserCard key={user._id} user={user} />
            })}
          </>

          // if there is no suggested users in data base
          : suggestedUsers?.length == 0 ?
            <p className={style.no_suggested_users}>
              Suggested Users Will appear Here
            </p>

            // if fetching data loading
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

const SuggestedUserCard = ({ user }) => {
  const { userId } = useContext(appContext);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const followUser = async () => {
    setLoading(true);
    await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, {
      userId: userId,
      userFollowedId: user._id
    })
      .then(res => {
        const { followed } = res.data;
        followed && setIsFollowed(true);
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
        unFollowed && setIsFollowed(false);
      })
      .catch(error => console.log(error));
    setLoading(false);
  }

  return (
    <div className={style.suggested_user_card}>
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
    </div>
  )
}

export default SuggestedUsers
