// RecipeList.jsx
import RecipeListItem from "./RecipeListItem";

export default function RecipeList({ recipes }) {
  return (
    // RecipeList.jsx
<div className="recipe-section">
  <h2>Recipes</h2>
  <ul className="recipe-list">
    {recipes.map((recipe) => (
      <RecipeListItem
        key={recipe.id}
        recipe={{
          title: recipe.name,
          cookTime: recipe.cookTimeMinutes,
          link: recipe.url || "#",
          category: recipe.mealType?.[0] || "Other",
          origin: recipe.cuisine,
        }}
      />
    ))}
  </ul>
</div>
  );
}