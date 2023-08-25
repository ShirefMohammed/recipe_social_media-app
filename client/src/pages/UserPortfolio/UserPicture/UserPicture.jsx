/* eslint-disable react/prop-types */
import { GetServerUrl, ConvertToBase64 } from "../../../hooks";
import style from "./UserPicture.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const UserPicture = ({ user, setUser }) => {
  const uploadUserPicture = async ({ target }) => {
    try {
      const userPictureFile = target.files[0];
      const base64 = await ConvertToBase64(userPictureFile);
      const promise = await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: user._id,
        picture: base64,
      });
      setUser(promise.data.user)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.user_picture}>
      <img
        src={user.picture}
        alt="user picture"
      />

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

export default UserPicture
