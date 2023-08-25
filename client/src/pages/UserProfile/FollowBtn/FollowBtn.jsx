/* eslint-disable react/prop-types */
import { useState, useContext, useEffect } from "react";
import { RotatingLines } from "react-loader-spinner";
import { GetServerUrl } from "../../../hooks";
import { AppContext } from "../../../App";
import style from "./FollowBtn.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const FollowBtn = ({ userFollowedId }) => {
  const { userId } = useContext(AppContext);
  const [isFollowed, setIsFollowed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const promise = await axios.post(`${serverUrl}/users/checkFollowStatus`, { userId: userId, followedId: userFollowedId });
        if (promise.data.followed) {
          setIsFollowed(true);
        } else {
          setIsFollowed(false);
        }
      } catch (error) {
        console.log(error);
      }
    }

    checkFollowStatus();
  }, [userId, userFollowedId])

  const followUser = async () => {
    try {
      setLoading(true);
      const promise = await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, { userId: userId, userFollowedId: userFollowedId });
      promise.data.followed && setIsFollowed(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const unFollowUser = async () => {
    try {
      setLoading(true);
      const promise = await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, { userId: userId, userUnFollowedId: userFollowedId });
      promise.data.unFollowed && setIsFollowed(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
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
  )
}

export default FollowBtn
