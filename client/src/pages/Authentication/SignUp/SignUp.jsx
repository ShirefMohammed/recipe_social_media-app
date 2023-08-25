import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";
import { GetServerUrl } from "../../../hooks";
import style from "./SignUp.module.css";
import axios from "axios";

const serverUrl = GetServerUrl();

const SignUp = () => {
  const [user, setUser] = useState({});
  const [passStrength, setPassStrength] = useState({});
  const [openPassStrength, setOpenPassStrength] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    setUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const checkPassStrength = async (e) => {
    const value = e.target.value;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signUp(user);
    Array.from(e.target.elements).map(element => element.value = "");
  }

  const signUp = async (user) => {
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
      const promise = await axios.post(`${serverUrl}/authentication/signUp`, {
        name: user.name,
        email: user.email,
        password: user.password,
        picture: user?.picture
      });

      const { created, message } = promise.data;

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
    } catch (error) {
      console.log(error);
    }
  }

  const handleGoogleLoginSuccess = async (response) => {
    const { name, email, sub, picture } = response.data;
    const user = {
      name: name,
      email: email,
      password: sub,
      passwordConfirmation: sub,
      picture: picture
    }
    await signUp(user);
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
          required
        />

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
          onFocus={() => setOpenPassStrength(true)}
          onChange={(e) => {
            handleChange(e);
            setPassStrength(checkPassStrength(e));
          }}
          required
        />

        {
          openPassStrength ?
            <ul className={style.password_strength}>
              <li>
                {
                  passStrength?.hasUpperAndLower ?
                    <i className={`fa-solid fa-check ${style.check}`}></i>
                    : <i className={`fa-solid fa-xmark ${style.Xmark}`}></i>
                }
                <span>Has Upper and Lower characters aA - zZ</span>
              </li>
              <li>
                {
                  passStrength?.hasDigit ?
                    <i className={`fa-solid fa-check ${style.check}`}></i>
                    : <i className={`fa-solid fa-xmark ${style.Xmark}`}></i>
                }
                <span>Has atLeast one digit 0 - 9</span>
              </li>
              <li>
                {
                  passStrength?.hasSymbol ?
                    <i className={`fa-solid fa-check ${style.check}`}></i>
                    : <i className={`fa-solid fa-xmark ${style.Xmark}`}></i>
                }
                <span>Has atLeast one symbol *$%#</span>
              </li>
              <li>
                {
                  passStrength?.lengthMore5 ?
                    <i className={`fa-solid fa-check ${style.check}`}></i>
                    : <i className={`fa-solid fa-xmark ${style.Xmark}`}></i>
                }
                <span>Length more than 5 characters</span>
              </li>
            </ul>
            : ""
        }

        <input
          type="password"
          name="passwordConfirmation"
          placeholder="confirm password"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="first_btn"
        >
          Sign Up
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
          text="SignUp With Google"
        />
      </LoginSocialGoogle>
    </div>
  )
}

export default SignUp
