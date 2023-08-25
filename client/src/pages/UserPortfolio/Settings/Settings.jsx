/* eslint-disable react/prop-types */
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GetServerUrl } from "../../../hooks";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";
import { PortfolioContext } from "../UserPortfolio";
import style from "./Settings.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const Settings = () => {
  const { user } = useContext(PortfolioContext);
  const { setCookies } = useContext(AppContext);
  const [passEditor, setPassEditor] = useState(false);
  const [passFormInputs, setPassFormInputs] = useState({});
  const [deleteEditor, setDeleteEditor] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const navigate = useNavigate();

  // Handle Old Password And New Password Inputs Change
  const handlePassChange = async (e) => {
    setPassFormInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Change Password When Submit Form
  const changePassword = async (e) => {
    try {
      e.preventDefault();

      const { oldPassword, newPassword } = passFormInputs;

      if (oldPassword === newPassword) {
        toast.error("enter strong password", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        const promise = await axios.post(`${serverUrl}/users/userPortfolio/updateAccount`, {
          userId: user._id,
          oldPassword: oldPassword,
          newPassword: newPassword,
        });

        const { changed, message } = promise.data;

        if (changed) {
          toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
        } else {
          toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }

        setPassEditor(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Delete User Account
  const deleteAccount = async (e) => {
    try {
      e.preventDefault();

      const promise = await axios.post(`${serverUrl}/users/userPortfolio/deleteAccount`, {
        userId: user._id,
        password: accountPassword,
      });

      const { deleted, message } = promise.data;

      if (deleted) {
        setCookies("access_token", "");
        localStorage.removeItem("userId");
        navigate("/");
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      setDeleteEditor(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={style.account_settings}>
      {/* name */}
      <div className={style.name}>
        <p>
          name: <span>{user.name}</span>
        </p>
      </div>

      {/* email */}
      <div className={style.email}>
        <p>
          email: <span>{user.email}</span>
        </p>
      </div>

      {/* Change Password */}
      <div className={style.password}>
        <span>Password: **********</span>

        <button
          className={`${style.change_password_btn} circle_btn`}
          onClick={() => setPassEditor(true)}
        >
          <i className="fa-solid fa-pen"></i>
        </button>

        {
          passEditor &&
          <div className={style.editor}>
            <button
              className={`${style.close_editor_btn} circle_btn`}
              onClick={() => setPassEditor(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <form onSubmit={changePassword}>
              <h2>Change Password</h2>

              <input
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                onChange={handlePassChange}
                required
              />

              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                onChange={handlePassChange}
                required
              />

              <button type="submit" className="first_btn">
                Change Password
              </button>
            </form>
          </div>
        }
      </div>

      {/* Delete Account */}
      <div className={style.delete_account}>
        <span>Delete Your Account:</span>

        <button
          className={`${style.delete_account_btn} circle_btn`}
          onClick={() => setDeleteEditor(true)}
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>

        {
          deleteEditor &&
          <div className={style.editor}>
            <button
              className={`${style.close_editor_btn} circle_btn`}
              onClick={() => setDeleteEditor(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <form onSubmit={deleteAccount}>
              <h2>Delete Account</h2>

              <input
                type="password"
                name="accountPassword"
                placeholder="Enter Your Password"
                onChange={(e) => setAccountPassword(e.target.value)}
                required
              />

              <button type="submit" className="first_btn">
                Delete Account
              </button>
            </form>
          </div>
        }
      </div>
    </div>
  );
};


export default Settings
