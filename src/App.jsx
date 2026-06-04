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
  const [selectedRecipe, setSelectedRecipe] = useState(null);

useEffect(() => {
  async function fetchRecipes() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5001/recipes");
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      setRecipes(data || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(error.message || "Something went wrong fetching recipes.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }
  fetchRecipes();
}, []);

// Filter recipes by title, category, origin, or ingredient (case-insensitive)
const search = submittedQuery.toLowerCase();
const filteredRecipes = recipes.filter(recipe => {
  return (
    recipe.name.toLowerCase().includes(search) ||
    (recipe.category && recipe.category.toLowerCase().includes(search)) ||
    (recipe.origin && recipe.origin.toLowerCase().includes(search)) ||
    (recipe.ingredients && recipe.ingredients.some(ing =>
      ing.item.toLowerCase().includes(search)
    ))
  );
});
// App.jsx
return (
  <div className="App">
    <h1 className="app-title">Recipe Finder</h1>
    {!selectedRecipe && (
      <>
        <SearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSubmitSearch={() => setSubmittedQuery(searchText)}
        />

        {loading && <p className="status-message">Loading recipes...</p>}
        {error && !loading && (
          <p className="status-message error-message">{error}</p>
        )}
        {!loading && !error && submittedQuery && filteredRecipes.length === 0 && (
          <p className="status-message">
            No recipes found for “{submittedQuery}”. Try another search.
          </p>
        )}
        {!loading && !error && filteredRecipes.length > 0 && (
          <RecipeList recipes={filteredRecipes} onSelect={setSelectedRecipe} />
        )}
      </>
    )}

    {selectedRecipe && (
      <div className="recipe-detail">
        <button onClick={() => setSelectedRecipe(null)}>Back to List</button>
        <h2>{selectedRecipe.name}</h2>
        <p><b>Category:</b> {selectedRecipe.category}</p>
        {selectedRecipe.origin && <p><b>Origin:</b> {selectedRecipe.origin}</p>}
        <p><b>Servings:</b> {selectedRecipe.servings}</p>
        <h3>Ingredients:</h3>
        <ul>
          {selectedRecipe.ingredients.map((ing, idx) => (
            <li key={idx}>
              {ing.qty} {ing.unit} {ing.item}
            </li>
          ))}
        </ul>
        {/* Place for conversion/scaler UI in the future */}
      </div>
    )}
  </div>
);
}

export default App;