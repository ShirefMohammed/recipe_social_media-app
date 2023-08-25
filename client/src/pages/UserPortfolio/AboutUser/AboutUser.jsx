/* eslint-disable react/prop-types */
import { useState } from "react";
import { GetServerUrl } from "../../../hooks";
import style from "./AboutUser.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const AboutUser = ({ user, setUser }) => {
  const [bioEditor, setBioEditor] = useState(false);
  const [bio, setBio] = useState();

  const ChangeBio = async (e) => {
    try {
      e.preventDefault();
      const promise = await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: user._id,
        bio: bio,
      });
      setUser(promise.data.user);
      setBioEditor(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.about_user}>
      <h2 className={style.name}>{user.name}</h2>

      <div className={style.bio}>
        <span>{user.bio}</span>

        <button
          className="circle_btn"
          onClick={() => setBioEditor(true)}
        >
          <i className="fa-solid fa-pen"></i>
        </button>

        {
          bioEditor &&
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
        }
      </div>
    </div>
  );
};

export default AboutUser
