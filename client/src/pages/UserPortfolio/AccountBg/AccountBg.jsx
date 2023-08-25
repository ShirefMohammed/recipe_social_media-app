/* eslint-disable react/prop-types */
import { GetServerUrl, ConvertToBase64 } from "../../../hooks";
import style from "./AccountBg.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const AccountBg = ({ user, setUser }) => {
  const uploadAccountBg = async ({ target }) => {
    try {
      const accountBgFile = target.files[0];
      const base64 = await ConvertToBase64(accountBgFile);
      const promise = await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, {
        userId: user._id,
        accountBg: base64,
      });
      setUser(promise.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.account_bg}>
      <img
        src={user.accountBg}
        alt="accountBg"
      />

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

export default AccountBg
