import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetServerAPI } from "../../hooks";
import { useCookies } from "react-cookie";

import style from "./Sign.module.css";
import axios from "axios";

const api = GetServerAPI();

// Sign Page
const Sign = () => {
  const { signType } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    signType !== "signUp" && signType !== "signIn" && navigate("*");
  }, [signType, navigate]);

  return (
    <div className={style.sign}>
      {signType === "signUp" ? <SignUp />
        : signType === "signIn" ? <SignIn />
          : ""}
    </div>
  )
}

// Create New Account SignUp
const SignUp = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    setUser(prev => ({ ...prev, [target.name]: target.value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${api}/users/sign/signUp`, {
      username: user.username,
      password: user.password,
    })
      .then(res => {
        const { accountCreated, message } = res.data;
        !accountCreated ? alert(message)
          : (navigate("/sign/signIn"), alert(message));
      });

    Array.from(e.target.elements).map(element => element.value = "");
  }

  return (
    <div className={style.sign_up}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}

// SignIn To My Account
const SignIn = () => {
  const [user, setUser] = useState({});
  const [, setCookies] = useCookies(["access_token"]);

  const handleChange = ({ target }) => {
    setUser(prev => ({ ...prev, [target.name]: target.value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`${api}/users/sign/signIn`, {
      username: user.username,
      password: user.password,
    })
      .then(res => {
        const { message, token, userId } = res.data;
        message ? alert(message)
          : setCookies("access_token", token),
          window.localStorage.setItem("userId", userId),
          window.location.href = "/";
      });

    Array.from(e.target.elements).map(element => element.value = "");
  }

  return (
    <div className={style.sign_in}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required />
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}

export default Sign
