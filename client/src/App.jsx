import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./hooks";
import { Header, Footer } from "./components";
import { Home, Sign, CreateRecipe, SavedRecipes, Recipe, UserPortfolio, User, NoPage } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <ScrollToTop /> {/* HOOK TO SCROLL TO (0, 0) ON EVERY ROUTE  */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/sign/:signType" element={<Sign />} />
          <Route path="/recipes/createRecipe" element={<CreateRecipe />} />
          <Route path="/recipes/savedRecipes" element={<SavedRecipes />} />
          <Route path="/recipes/recipeId/:recipeId" element={<Recipe />} />
          <Route path="/userPortfolio" element={<UserPortfolio />} />
          <Route path="/users/:username" element={<User />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
