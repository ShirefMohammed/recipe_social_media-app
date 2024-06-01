import { createContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import { GetServerUrl, ScrollToTop } from "./hooks";
import { Header, Footer, FirstReqLoadingMsg } from "./components";
import {
  Home,
  Authentication,
  UserPortfolio,
  CreateRecipe,
  Recipe,
  UserProfile,
  SearchResults,
  NoPage,
} from "./pages";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const serverUrl = GetServerUrl();

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

function App() {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    if (cookies.access_token) {
      setUserId(localStorage.getItem("userId"));
    } else {
      setUserId("");
    }
  }, [cookies]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const response = await axios.get(
            `${serverUrl}/users/getUser/userId/${userId}`
          );
          setUser(response.data.user);
        } else {
          setUser({});
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <AppContext.Provider
      value={{
        cookies,
        setCookies,
        userId,
        setUserId,
        user,
        setUser,
      }}
    >
      <BrowserRouter>
        <div className="app">
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/authentication/:authType"
              element={<Authentication />}
            />

            <Route path="/userPortfolio" element={<UserPortfolio />} />

            <Route path="/recipes/createRecipe" element={<CreateRecipe />} />

            <Route path="/recipes/:recipeId" element={<Recipe />} />

            <Route path="/users/:userId" element={<UserProfile />} />

            <Route path="/searchResults" element={<SearchResults />} />

            <Route path="*" element={<NoPage />} />
          </Routes>

          <Footer />
        </div>

        {/* scroll to (0, 0) when path changes */}
        <ScrollToTop />

        {/* Server First Request Loading Message */}
        <FirstReqLoadingMsg />

        {/* ToastContainer */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
