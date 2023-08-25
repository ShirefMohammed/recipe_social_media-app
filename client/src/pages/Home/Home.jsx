/* eslint-disable react/prop-types */
import { useContext } from "react";
import { UserCard, SuggestedUsers } from "../../components";
import { AppContext } from "../../App";
import Recipes from "./Recipes/Recipes";
import style from "./Home.module.css";

const Home = () => {
  const { user } = useContext(AppContext);

  return (
    <section className={`container ${style.home}`}>
      <section className={style.user_card_container}>
        {user._id && <UserCard user={user} />}
      </section>

      <section className={style.recipes_container}>
        <Recipes />
      </section>

      <section className={style.suggested_users_container}>
        {user._id && <SuggestedUsers />}
      </section>
    </section>
  )
}

export default Home
