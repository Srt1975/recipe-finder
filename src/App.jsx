import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import AdminList from "./components/AdminList";
import AddRecipeForm from "./components/AddRecipeForm";
import conv from "./utils/conversions";
import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailServings, setDetailServings] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

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

// sync detailServings when a recipe is selected
  // initialize detailServings when a recipe is selected
  function handleSelectRecipe(recipe) {
    setSelectedRecipe(recipe);
    setDetailServings(recipe ? (recipe.servings || 1) : null);
  }

// conversion helpers moved to src/utils/conversions.js (use `conv` import)

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
    <h1 className="app-title">{selectedRecipe ? 'Recipe View' : 'Recipe Finder'}</h1>
      <div style={{display: 'flex', justifyContent: 'flex-end', gap: 8}}>
        <button className="back-button" onClick={() => setShowAddForm(s => !s)}>{showAddForm ? 'Hide Add' : 'Add Recipe'}</button>
        <button className="back-button" onClick={() => setShowAdmin(s => !s)}>{showAdmin ? 'Hide Admin' : 'Show Admin'}</button>
      </div>
    {!selectedRecipe && (
      <>
        {showAddForm && (
          <AddRecipeForm
            onCancel={() => setShowAddForm(false)}
            onAdded={(newRecipe) => {
              // append to list and open detail view
              setRecipes(r => [ ...(r || []), newRecipe ]);
              setSelectedRecipe(newRecipe);
              setDetailServings(newRecipe.servings || 1);
              setShowAddForm(false);
            }}
          />
        )}
        <SearchBar
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onSubmitSearch={() => setSubmittedQuery(searchText)}
        />

        {/* Category buttons row */}
        {recipes && recipes.length > 0 && (
          (() => {
            const cats = Array.from(new Set(recipes.map(r => r.category).filter(Boolean)));
            return (
              <div className="category-row" role="tablist" aria-label="Categories">
                <button
                  className={`category-button ${submittedQuery === '' ? 'active' : ''}`}
                  onClick={() => { setSearchText(''); setSubmittedQuery(''); }}
                >
                  All
                </button>
                {cats.map((c) => (
                  <button
                    key={c}
                    className={`category-button ${submittedQuery === c ? 'active' : ''}`}
                    onClick={() => { setSearchText(c); setSubmittedQuery(c); }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            );
          })()
        )}

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
          <RecipeList recipes={filteredRecipes} onSelect={handleSelectRecipe} />
        )}
      </>
    )}

    {selectedRecipe && (
      <div className="recipe-detail">
        <button
          className="back-button"
          onClick={() => setSelectedRecipe(null)}
          aria-label="Back to list"
        >
          ← Back
        </button>

        <div className="recipe-card detail">
          <h2>{selectedRecipe.name}</h2>

          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <button
              className="back-button"
              onClick={async () => {
                if (!selectedRecipe || !selectedRecipe.id) return;
                const ok = confirm('Delete this recipe?');
                if (!ok) return;
                try {
                  const res = await fetch(`http://localhost:5001/recipes/${selectedRecipe.id}`, { method: 'DELETE' });
                  if (!res.ok) {
                    const body = await res.json().catch(() => ({}));
                    throw new Error(body.error || `Request failed ${res.status}`);
                  }
                  // remove locally and close detail
                  setRecipes(r => (r || []).filter(x => x.id !== selectedRecipe.id));
                  setSelectedRecipe(null);
                } catch (err) {
                  alert('Failed to delete: ' + (err.message || err));
                }
              }}
            >
              Delete
            </button>
          </div>

          <div className="recipe-meta">
            {selectedRecipe.category && (
              <span className="badge category">{selectedRecipe.category}</span>
            )}
            {selectedRecipe.origin && (
              <span className="badge origin">{selectedRecipe.origin}</span>
            )}
            {/* servings shown via the interactive control below in detail view */}
          </div>

          {/* Ingredients scaler and display controls are below */}

          <div className="detail-controls">
            <div className="servings-control">
              <label htmlFor="servings-input">Servings</label>
              <div className="servings-row">
                <button aria-label="Decrease servings" onClick={() => setDetailServings(s => Math.max(1, (s || 1) - 1))}>-</button>
                <input
                  id="servings-input"
                  className="servings-input"
                  type="number"
                  min={1}
                  value={detailServings || selectedRecipe.servings || 1}
                  onChange={e => {
                    let v = Number(e.target.value) || 1;
                    setDetailServings(v);
                  }}
                />
                <button aria-label="Increase servings" onClick={() => setDetailServings(s => (s || 1) + 1)}>+</button>
              </div>
            </div>

            {/* Converted display is always used */}
          </div>

          <h3>Ingredients</h3>
          <ul className="ingredients-list">
            {selectedRecipe.ingredients.map((ing, idx) => {
              const origQty = Number(ing.qty) || 0;
              const scaledQty = detailServings && selectedRecipe.servings ? (origQty * (detailServings / selectedRecipe.servings)) : origQty;
              const display = conv.convertIngredient(ing, scaledQty);
              return (
                <li key={idx} className="ingredient-row">
                  <span className="ingredient-qty">{display.qty} {display.unit}</span>
                  <span className="ingredient-name">{ing.item}</span>
                </li>
              );
            })}
          </ul>
          {selectedRecipe.instructions && (
            <div className="instructions">
              <h3>Instructions</h3>
              <p>{selectedRecipe.instructions}</p>
            </div>
          )}
        </div>
      </div>
    )}
  {showAdmin && <AdminList recipes={recipes} />}
  </div>
);
}

export default App;