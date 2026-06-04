// RecipeList.jsx
import RecipeListItem from "./RecipeListItem";

// RecipeList.jsx
export default function RecipeList({ recipes, onSelect }) {
  return (
    <div className="recipe-section">
      <h2>Recipes</h2>
      <ul className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeListItem
            key={recipe.id}
            recipe={recipe}
            onClick={() => onSelect(recipe)}
          />
        ))}
      </ul>
    </div>
  );
}