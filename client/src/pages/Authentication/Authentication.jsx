import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SignUp from "./SignUp/SignUp"
import SignIn from "./SignIn/SignIn"
import style from "./Authentication.module.css";

const Sign = () => {
  const { authType } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    authType !== "signUp" && authType !== "signIn" && navigate("*");
  }, [authType, navigate]);

  return (
    <section className={style.sign}>
      {
        authType === "signUp" ? <SignUp />
          : authType === "signIn" ? <SignIn />
            : ""
      }
    </section>
  )
}

export default Sign
