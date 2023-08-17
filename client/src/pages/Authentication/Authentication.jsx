import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";
import { GetServerUrl } from "../../hooks";
import { appContext } from "../../App";


import style from "./Authentication.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

// Sign Page
const Sign = () => {
  const { authType } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    authType !== "signUp" && authType !== "signIn" && navigate("*");
  }, [authType, navigate]);

  return (
    <section className={style.sign}>
      {authType === "signUp" ? <SignUp />
        : authType === "signIn" ? <SignIn />
          : ""}
    </section>
  )
}

// SignUp
const SignUp = () => {
  const [user, setUser] = useState({});
  const [passStrength, setPassStrength] = useState({});
  const [openPassStrength, setOpenPassStrength] = useState(false);
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    setUser(prev => ({ ...prev, [target.name]: target.value }));
  }

  const checkPassStrength = ({ target }) => {
    const { value } = target;
    const result = {};

    // Check for at least one uppercase character
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) {
      result.hasUpperAndLower = true;
    }

    // Check for at least one digit
    if (/\d/.test(value)) {
      result.hasDigit = true;
    }

    // Check for at least one special symbol
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
      result.hasSymbol = true;
    }

    // Check for length more than 5
    if (value.length > 5) {
      result.lengthMore5 = true;
    }

    return result;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(user);
    Array.from(e.target.elements).map(element => element.value = "");
  }

  const signUp = (user) => {
    if (user.password !== user.passwordConfirmation) {
      toast.error("two passwords must be same", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return null;
    }

    try {
      axios.post(`${serverUrl}/authentication/signUp`, {
        name: user.name,
        email: user.email,
        password: user.password,
        picture: user?.picture
      }).then(res => {
        const { created, message } = res.data;
        if (!created) {
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
          navigate("/authentication/signIn");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleGoogleLoginSuccess = (response) => {
    const { name, email, sub, picture } = response.data;
    const user = {
      name: name,
      email: email,
      password: sub,
      passwordConfirmation: sub,
      picture: picture
    }
    signUp(user);
  };

  return (
    <div className={style.sign_up}>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="name"
          onChange={handleChange}
          required />
        <input
          type="email"
          name="email"
          placeholder="email"
          onChange={handleChange}
          required />
        <input
          type="password"
          name="password"
          placeholder="password"
          onFocus={() => setOpenPassStrength(true)}
          onChange={(e) => {
            handleChange(e);
            setPassStrength(checkPassStrength(e));
          }}
          required />
        {openPassStrength ?
          <ul className={style.password_strength}>
            <li>
              {passStrength?.hasUpperAndLower ?
                <i className={`fa-solid fa-check ${style.check}`}></i>
                : <i className={`fa-solid fa-xmark ${style.Xmark}`}></i>}
              <span>Has Upper and Lower characters aA - zZ</span>
            </li>
            <li>
              {passStrength?.hasDigit ?
                <i className={`fa-solid fa-check ${style.check}`}></i>
                : <i className={`fa-solid fa-xmark ${style.Xmark}`}></i>}
              <span>Has atLeast one digit 0 - 9</span>
            </li>
            <li>
              {passStrength?.hasSymbol ?
                <i className={`fa-solid fa-check ${style.check}`}></i>
                : <i className={`fa-solid fa-xmark ${style.Xmark}`}></i>}
              <span>Has atLeast one symbol *$%#</span>
            </li>
            <li>
              {passStrength?.lengthMore5 ?
                <i className={`fa-solid fa-check ${style.check}`}></i>
                : <i className={`fa-solid fa-xmark ${style.Xmark}`}></i>}
              <span>Length more than 5 characters</span>
            </li>
          </ul> : ""}
        <input
          type="password"
          name="passwordConfirmation"
          placeholder="confirm password"
          onChange={handleChange}
          required />
        <button type="submit" className="first_btn">Sign Up</button>
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
          text="SignUp With Google"
        />
      </LoginSocialGoogle>
    </div>
  )
}

// SignIn To My Account
const SignIn = () => {
  const [user, setUser] = useState({});
  const { setCookies } = useContext(appContext);
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    setUser(prev => ({ ...prev, [target.name]: target.value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(user);
    Array.from(e.target.elements).map(element => element.value = "");
  }

  const signIn = (user) => {
    try {
      axios.post(`${serverUrl}/authentication/signIn`, {
        email: user.email,
        password: user.password,
      }).then(res => {
        const { message, token, userId } = res.data;
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
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleGoogleLoginSuccess = (response) => {
    const { email, sub } = response.data;
    const user = {
      email: email,
      password: sub
    }
    signIn(user);
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
          required />
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
          required />
        <button type="submit" className="first_btn">Sign In</button>
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

export default Sign
