/* eslint-disable react/prop-types */
import { useEffect, useContext, useRef } from "react";
import { RotatingLines } from "react-loader-spinner";
import { PortfolioContext } from "../UserPortfolio";
import UserCard from "../UserCard/UserCard";
import style from "./Users.module.css";

const Users = ({
  users,
  startIdx,
  setStartIdx,
  btnLoading,
  following,
  followers
}) => {
  const { range } = useContext(PortfolioContext);
  const usersLengthBefore = useRef(0);

  useEffect(() => {
    usersLengthBefore.current = users.length;
  }, [users]);

  return (
    <>
      {
        users.length > 0 || usersLengthBefore.current > 0 ?
          // users container
          <div className={style.users}>
            <div className={style.users_page}>
              {
                users.length > 0 ?
                  users.map(user =>
                    user._id ?
                      <UserCard
                        key={user._id}
                        cardData={user}
                        following={following}
                        followers={followers}
                      />
                      : ""
                  )
                  : users.length == 0 ?
                    <p className={style.last_page}>the last page go back</p>
                    : ""
              }
            </div>

            {/* pagination */}
            <div className={style.pagination}>
              <button
                disabled={btnLoading || startIdx == 0 ? true : false}
                style={btnLoading || startIdx == 0 ? { cursor: "revert" } : {}}
                onClick={() => {
                  setStartIdx(prev => prev - range);
                }}
              >
                <i className="fa-solid fa-angles-left"></i>
                prev
              </button>

              <span className={style.page_number}>
                {
                  btnLoading ?
                    <RotatingLines
                      strokeColor="gray"
                      strokeWidth="5"
                      animationDuration="0.75"
                      width="15"
                      visible={true}
                    />
                    : users.length == 0 ? "-"
                      : startIdx / range + 1
                }
              </span>

              <button
                disabled={btnLoading || users.length >= 0 &&
                  users.length < usersLengthBefore.current ? true : false
                }
                style={btnLoading || users.length >= 0 &&
                  users.length < usersLengthBefore.current ?
                  { cursor: "revert" } : {}
                }
                onClick={() => {
                  setStartIdx(prev => prev + range);
                }}
              >
                next
                <i className="fa-solid fa-angles-right"></i>
              </button>
            </div>
          </div>

          : btnLoading ?
            <div className={style.spinner_container}>
              <RotatingLines
                strokeColor="gray"
                strokeWidth="5"
                animationDuration="0.75"
                width="30"
                visible={true}
              />
            </div>

            // users.length == 0 && usersLengthBefore.current == 0
            : <div className={style.no_users}>
              No Users Exist
            </div>
      }
    </>
  )
}

export default Users
