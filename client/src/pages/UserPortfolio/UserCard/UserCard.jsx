/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GetServerUrl } from "../../../hooks";
import { RotatingLines } from "react-loader-spinner";
import { AppContext } from "../../../App";
import { PortfolioContext } from "../UserPortfolio";
import style from "./UserCard.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const UserCard = ({ cardData, following, followers }) => {
  const { userId } = useContext(AppContext);
  const { fetchUser } = useContext(PortfolioContext);
  const [loading, setLoading] = useState(false);

  const unFollowUser = async () => {
    try {
      setLoading(true);
      const promise = await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: userId,
        userUnFollowedId: cardData._id
      });
      if (promise.data.unFollowed) {
        await fetchUser();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const removeFollower = async () => {
    try {
      setLoading(true);
      const promise = await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: userId,
        removedFollowerId: cardData._id
      });
      if (promise.data.removed) {
        await fetchUser();
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={style.user_card}>
      <img
        src={cardData.picture}
        alt="user picture"
      />

      <div className={style.middle_side}>
        <Link to={`/users/${cardData._id}`}>
          {cardData.name}
        </Link>

        <p>
          {cardData.bio}
        </p>
      </div>

      {
        following &&
        <button
          disabled={loading}
          style={loading ? { opacity: ".5", cursor: "revert" } : {}}
          className={style.unFollow}
          onClick={unFollowUser}
        >
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
        </button>
      }

      {
        followers &&
        <button
          disabled={loading}
          style={loading ? { opacity: ".5", cursor: "revert" } : {}}
          className={style.remove}
          onClick={removeFollower}
        >
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
            remove
          </>
        </button>
      }
    </div>
  )
}

export default UserCard
