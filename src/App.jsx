import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import RecipeListItem from "./components/RecipeListItem";
import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
  if (!submittedQuery) return;

  async function fetchRecipes() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://dummyjson.com/recipes/search?q=${encodeURIComponent(
          submittedQuery
        )}`
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(error.message || "Something went wrong fetching recipes.");
      setRecipes([]); // clear old results on error
    } finally {
      setLoading(false);
    }
  }

  fetchRecipes();
}, [submittedQuery]);

// App.jsx
return (
  <div className="App">
    <h1 className="app-title">Recipe Finder</h1>
    <SearchBar
      searchText={searchText}
      onSearchTextChange={setSearchText}
      onSubmitSearch={() => setSubmittedQuery(searchText)}
    />

    {loading && <p className="status-message">Loading recipes...</p>}
    {error && !loading && (
      <p className="status-message error-message">{error}</p>
    )}
    {!loading && !error && submittedQuery && recipes.length === 0 && (
      <p className="status-message">
        No recipes found for “{submittedQuery}”. Try another search.
      </p>
    )}
    {!loading && !error && recipes.length > 0 && (
      <RecipeList recipes={recipes} />
    )}
  </div>
);
}

export default App;