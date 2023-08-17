/* eslint-disable react/prop-types */
import { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appContext } from "../../App";
import style from "./Header.module.css";
import LogoIcon from "../../assets/LogoIcon.png";
import userPictureAlt from "../../assets/userPictureAlt.png";

const Header = () => {
  const bars = useRef();
  const XMark = useRef();
  const Search = useRef();
  const [openOptions, setOpenOptions] = useState(false);

  const { user, cookies } = useContext(appContext);

  const [searchKey, setSearchKey] = useState();
  const navigate = useNavigate();

  // Toggle sideBar
  const toggleSideBar = () => {
    bars.current.classList.toggle(style.d_none);
    XMark.current.classList.toggle(style.d_none);
    Search.current.classList.toggle(style.close_search_sm);
    setOpenOptions(false);
  }

  // closeAll Opened Taps
  const closeAllTaps = () => {
    bars.current.classList.remove(style.d_none);
    XMark.current.classList.add(style.d_none);
    Search.current.classList.add(style.close_search_sm);
    setOpenOptions(false);
  }

  // Navigate To User Page With searchKey
  const SearchUser = (e) => {
    e.preventDefault();
    navigate(`/users/${searchKey}`);
    closeAllTaps();
    setSearchKey("");
  }

  return (
    <header className={style.header}>
      <div className={`${style.content} container`}>
        {/* left side */}
        <div className={style.left_side}
          style={!cookies.access_token ? { gap: "20px" } : {}}
        >
          {/* toggle button */}
          <button
            className={`${style.sideBar_btn} circle_btn`}
            onClick={toggleSideBar}>
            <i className={`fa-solid fa-bars ${style.bars}`} ref={bars}></i>
            <i className={`fa-solid fa-xmark ${style.XMark} ${style.d_none}`}
              ref={XMark}></i>
          </button>

          {/* logo link */}
          <Link to='/' onClick={closeAllTaps}>
            <img className={style.logo} src={LogoIcon} alt="Logo" />
          </Link>

          {/* Search Form */}
          <div className={`${style.search} ${style.close_search_sm}`}
            ref={Search}>
            <form onSubmit={SearchUser}>
              <input
                required
                type="text"
                placeholder="search about user"
                value={searchKey}
                onChange={e => setSearchKey(e.target.value)}
              />
              <button type="submit" className="circle_btn">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        </div>

        {/* right side */}
        <div className={style.right_side}>
          {
            cookies.access_token ?
              // If cookies.access_token return options
              <div className={style.options}>
                <button
                  className={`${style.options_btn} circle_btn`}
                  onClick={() => setOpenOptions(prev => !prev)}>
                  <img
                    src={user?.picture || userPictureAlt}
                    alt="user Picture" />
                </button>
                {
                  openOptions &&
                  <div className={style.options_container}>
                    <OptionsList closeAllTaps={closeAllTaps} />
                  </div>
                }
              </div>
              // else return signIn or signUp
              : <SignLinks closeAllTaps={closeAllTaps} />
          }
        </div>
      </div>
    </header>
  )
}

const SignLinks = ({ closeAllTaps }) => {
  return (
    <nav>
      <ul className={style.sign_links}>
        <li>
          <Link
            to="/authentication/signIn"
            className="second_btn"
            onClick={closeAllTaps}>
            SignIn
          </Link>
        </li>
        <li>
          <Link
            to="/authentication/signUp"
            className="first_btn"
            onClick={closeAllTaps}>
            SignUp
          </Link>
        </li>
      </ul>
    </nav>
  )
}

const OptionsList = ({ closeAllTaps }) => {
  const { setCookies } = useContext(appContext);

  const logOut = () => {
    setCookies("access_token", "");
    localStorage.setItem("userId", "");
  }

  return (
    <nav>
      <ul className={`${style.options_list} fade_up`} >
        <li>
          <Link
            to="/userPortfolio"
            onClick={closeAllTaps}>
            Your Portfolio
            <i className="fa-solid fa-gear"></i>
          </Link>
        </li>
        <li>
          <Link
            to='/recipes/createRecipe'
            onClick={closeAllTaps}>
            Create Recipe
            <i className="fa-solid fa-circle-plus"></i>
          </Link>
        </li>
        <li>
          <Link
            to='/recipes/savedRecipes'
            onClick={closeAllTaps}>
            Saved Recipes
            <i className="fa-solid fa-cloud"></i>
          </Link>
        </li>
        <li>
          <span onClick={() => {
            closeAllTaps();
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
