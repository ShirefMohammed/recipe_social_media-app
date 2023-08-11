import { useRef, useState, useEffect, useContext, createContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { GetServerAPI, GetUserId } from "../../hooks";

import style from "./Header.module.css";
import LogoIcon from "../../assets/LogoIcon.png";
import userAvatarAlt from "../../assets/userAvatarAlt.png";
import axios from "axios";

const userContext = createContext();
const api = GetServerAPI();
const userId = GetUserId();

const Header = () => {
  const bars = useRef();
  const xMark = useRef();
  const headerLinks = useRef();

  const [UserList, setUserList] = useState(false);
  const [cookies,] = useCookies(["access_token"]);
  const [userAvatar, setUserAvatar] = useState();
  const [searchKey, setSearchKey] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    cookies.access_token &&
      axios.post(`${api}/users/getUser`, { userId: userId })
        .then(res => setUserAvatar(res.data.user.userAvatar));
  }, [cookies]);

  // toggleLinks() for links_toggle_btn to close and open user list
  const toggleLinks = () => {
    bars.current.classList.toggle(style.display_none);
    xMark.current.classList.toggle(style.display_none);
    headerLinks.current.classList.toggle(style.close_links_sm);
  }

  // closeAll() to close all opened lists or links in header
  const closeAll = () => {
    bars.current.classList.remove(style.display_none);
    xMark.current.classList.add(style.display_none);
    headerLinks.current.classList.add(style.close_links_sm);
    setUserList(false);
  }

  const SearchUser = (e) => {
    e.preventDefault();
    navigate(`/users/${searchKey}`);
    Array.from(e.target.elements).map(element => element.value = "");
  }

  return (
    <header className={style.header}>
      <div className={`${style.content} container`}>

        {/* left side */}
        <div className={style.left_side}>
          {/* toggle button */}
          <button
            className={`${style.links_toggle_btn} circle_btn`}
            onClick={toggleLinks}>
            <i
              className={`fa-solid fa-bars ${style.bars}`}
              ref={bars}>
            </i>
            <i
              className={`fa-solid fa-xmark ${style.xMark} 
              ${style.display_none}`}
              ref={xMark}>
            </i>
          </button>

          {/* logo link */}
          <Link
            to='/'
            onClick={closeAll}>
            <img className={style.logo} src={LogoIcon} alt="Logo" />
          </Link>

          {/* links */}
          <nav>
            <ul
              className={`${style.links} ${style.close_links_sm}`}
              ref={headerLinks}>
              <form onSubmit={SearchUser} className={style.search_user}>
                <input
                  type="text"
                  placeholder="search about user"
                  onChange={e => setSearchKey(e.target.value)}
                  required />
                <button type="submit" className={`circle_btn`}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </form>
            </ul>
          </nav>
        </div>

        {/* right side */}
        <div className={style.right_side}>
          {/* user button and its list */}
          <div className={style.user}>
            <button
              className={`${style.userAvatar_btn} circle_btn`}
              onClick={() => setUserList(prev => !prev)}>
              <img src={userAvatar || userAvatarAlt} alt="userAvatar" />
            </button>
            {/* userContext to provide lists with closeAll() function */}
            <userContext.Provider value={closeAll}>
              {UserList ?
                <div className={style.user_list_container}>
                  {cookies.access_token ?
                    <ListAfterSignIn />
                    : <ListBeforeSignIn />}
                </div>
                : ""}
            </userContext.Provider>
          </div>
        </div>

      </div>
    </header>
  )
}

// User List Before Sign In
const ListBeforeSignIn = () => {
  const closeAll = useContext(userContext);

  return (
    <nav>
      <ul className={style.ListBeforeSignIn}>
        <li>
          <Link
            to="/sign/signUp"
            onClick={closeAll}>
            Sign Up
            <i className="fa-solid fa-right-to-bracket"></i>
          </Link>
        </li>
        <li>
          <Link
            to="/sign/signIn"
            onClick={closeAll}>
            Sign In
            <i className="fa-solid fa-right-to-bracket"></i>
          </Link>
        </li>
      </ul>
    </nav>
  )
}

// User List After Sign In
const ListAfterSignIn = () => {
  const closeAll = useContext(userContext);
  const [, setCookies] = useCookies(["access_token"]);

  const logOut = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userId");
    window.location.href = "/sign/signIn";
  }

  return (
    <nav>
      <ul className={style.ListAfterSignIn} >
        <li>
          <Link
            to="/userPortfolio"
            onClick={closeAll}>
            Your Portfolio
            <i className="fa-solid fa-gear"></i>
          </Link>
        </li>
        <li>
          <Link
            to='/recipes/createRecipe'
            onClick={closeAll}>
            Create Recipe
            <i className="fa-solid fa-circle-plus"></i>
          </Link>
        </li>
        <li>
          <Link
            to='/recipes/savedRecipes'
            onClick={closeAll}>
            Saved Recipes
            <i className="fa-solid fa-cloud"></i>
          </Link>
        </li>
        <li>
          <span onClick={() => {
            closeAll();
            logOut();
          }}>
            Log Out
            <i className="fa-solid fa-right-from-bracket"></i>
          </span>
        </li>
      </ul>
    </nav>
  )
}

export default Header
