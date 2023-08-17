import { createContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCookies } from "react-cookie";
import { GetServerUrl, ScrollToTop } from "./hooks";
import { Header, Footer } from "./components";
import { Home, Authentication, CreateRecipe, SavedRecipes, Recipe, UserPortfolio, User, NoPage } from "./pages";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
const serverUrl = GetServerUrl()

// eslint-disable-next-line react-refresh/only-export-components
export const appContext = createContext();

function App() {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    cookies.access_token && setUserId(localStorage.getItem("userId"));
  }, [cookies]);

  useEffect(() => {
    if (!userId) return;
    const getUser = async () => {
      axios.get(`${serverUrl}/users/getUser/userId/${userId}`)
        .then(res => setUser(res.data.user))
        .catch(error => console.log(error));
    }
    getUser();
  }, [userId]);

  return (
    <appContext.Provider value={{
      cookies, setCookies,
      userId, setUserId,
      user, setUser
    }}
    >
      <BrowserRouter>
        <div className="app">
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/authentication/:authType" element={<Authentication />}
            />
            <Route path="/recipes/createRecipe" element={<CreateRecipe />} />
            <Route path="/recipes/savedRecipes" element={<SavedRecipes />} />
            <Route path="/recipes/:recipeId" element={<Recipe />} />
            <Route path="/userPortfolio" element={<UserPortfolio />} />
            <Route path="/users/:userId" element={<User />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
          <Footer />
        </div>
        {/* Hooks */}
        <>
          <ScrollToTop /> {/* HOOK TO SCROLL TO (0, 0) ON EVERY ROUTE  */}
        </>
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
    </appContext.Provider>
  )
}

export default App
