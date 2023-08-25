/* eslint-disable react/prop-types */
import { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import style from "./Header.module.css";
import LogoIcon from "../../assets/LogoIcon.png";
import userPictureAlt from "../../assets/userPictureAlt.png";

const Header = () => {
  const barsRef = useRef();
  const XMarkRef = useRef();
  const searchRef = useRef();
  const [openOptions, setOpenOptions] = useState(false);
  const { user, cookies } = useContext(AppContext);
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();

  // Toggle sideBar
  const toggleSideBar = () => {
    barsRef.current.classList.toggle(style.d_none);
    XMarkRef.current.classList.toggle(style.d_none);
    searchRef.current.classList.toggle(style.close_search_sm);
    setOpenOptions(false);
  };

  // closeAll Opened Taps
  const closeAllTaps = () => {
    barsRef.current.classList.remove(style.d_none);
    XMarkRef.current.classList.add(style.d_none);
    searchRef.current.classList.add(style.close_search_sm);
    setOpenOptions(false);
  };

  // search
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/searchResults?searchKey=${searchKey}`);
    closeAllTaps();
    setSearchKey("");
  };

  return (
    <header className={style.header}>
      <div className={`${style.content} container`}>
        <div
          className={style.left_side}
          style={!cookies.access_token ? { gap: "20px" } : {}}
        >

          <button
            className={`${style.sideBar_btn} circle_btn`}
            onClick={toggleSideBar}
          >
            <i className={`fa-solid fa-bars ${style.bars}`} ref={barsRef}></i>
            <i className={`fa-solid fa-xmark ${style.XMark} ${style.d_none}`} ref={XMarkRef}></i>
          </button>

          <Link to="/" onClick={closeAllTaps}>
            <img
              className={style.logo}
              src={LogoIcon}
              alt="Logo" />
          </Link>

          <div
            className={`${style.search} ${style.close_search_sm}`}
            ref={searchRef}
          >
            <form onSubmit={handleSearch}>
              <input
                required
                type="text"
                placeholder="Search about user"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />

              <button type="submit" className="circle_btn">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        </div>

        <div className={style.right_side}>
          {
            cookies.access_token ? (
              <div className={style.options}>
                <button
                  className={`${style.options_btn} circle_btn`}
                  onClick={() => setOpenOptions((prev) => !prev)}
                >
                  <img
                    src={user?.picture || userPictureAlt}
                    alt="User Picture"
                  />
                </button>
                {
                  openOptions && (
                    <div className={style.options_container}>
                      <OptionsList closeAllTaps={closeAllTaps} />
                    </div>
                  )
                }
              </div>
            )
              : (
                <SignLinks closeAllTaps={closeAllTaps} />
              )
          }
        </div>
      </div>
    </header>
  );
};

const SignLinks = ({ closeAllTaps }) => {
  return (
    <nav>
      <ul className={style.sign_links}>
        <li>
          <Link
            to="/authentication/signIn"
            className="second_btn"
            onClick={closeAllTaps}
          >
            SignIn
          </Link>
        </li>
        <li>
          <Link
            to="/authentication/signUp"
            className="first_btn"
            onClick={closeAllTaps}
          >
            SignUp
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const OptionsList = ({ closeAllTaps }) => {
  const { setCookies } = useContext(AppContext);
  const navigate = useNavigate();

  const logOut = () => {
    setCookies("access_token", "");
    localStorage.setItem("userId", "");
    navigate("/authentication/signIn");
  };

  return (
    <nav>
      <ul className={`${style.options_list} fade_up`}>
        <li>
          <Link
            to="/userPortfolio"
            onClick={closeAllTaps}
          >
            Your Portfolio <i className="fa-solid fa-gear"></i>
          </Link>
        </li>

        <li>
          <Link
            to="/recipes/createRecipe"
            onClick={closeAllTaps}
          >
            Create Recipe <i className="fa-solid fa-circle-plus"></i>
          </Link>
        </li>

        <li>
          <span onClick={() => {
            closeAllTaps();
            logOut();
          }}
          >
            Log Out <i className="fa-solid fa-right-from-bracket"></i>
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default Header;