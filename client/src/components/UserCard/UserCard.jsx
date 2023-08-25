/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import style from "./UserCard.module.css";

const UserCard = ({ user }) => {
  return (
    <div className={style.user_card}>
      <img
        className={style.accountBg}
        src={user.accountBg}
        alt="user account bg"
      />

      <img
        className={style.picture}
        src={user.picture}
        alt="user picture"
      />

      <Link to={`/users/${user._id}`} className={style.name}>
        {user.name}
      </Link>

      <p className={style.bio}>
        {user.bio}
      </p>
    </div>
  )
}

export default UserCard
