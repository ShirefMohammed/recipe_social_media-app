import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";
import { GetServerUrl } from "../../../hooks";
import { AppContext } from "../../../App";
import style from "./SignIn.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const SignIn = () => {
  const [user, setUser] = useState({});
  const { setCookies } = useContext(AppContext);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn(user);
    Array.from(e.target.elements).map(element => element.value = "");
  }

  const signIn = async (user) => {
    try {
      const promise = await axios.post(`${serverUrl}/authentication/signIn`, {
        email: user.email,
        password: user.password,
      });

      const { message, token, userId } = promise.data;

      if (message) {
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
      } else {
        setCookies("access_token", token);
        localStorage.setItem("userId", userId);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleGoogleLoginSuccess = async (response) => {
    const { email, sub } = response.data;
    const user = {
      email: email,
      password: sub
    }
    await signIn(user);
  };

  return (
    <div className={style.sign_in}>
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="first_btn"
        >
          Sign In
        </button>
      </form>

      <div className={style.border_or}>or</div>

      <LoginSocialGoogle
        client_id={"1092651149918-nc8s21p9f5hc68lcu7penp77andrav5u.apps.googleusercontent.com"}
        cookiePolicy="single_host_origin"
        scope="profile email"
        onResolve={handleGoogleLoginSuccess}
        onReject={error => console.log(error)}
      >
        <GoogleLoginButton
          className={style.google_sign_btn}
          text="SignIn With Google"
        />
      </LoginSocialGoogle>
    </div>
  )
}

export default SignIn
