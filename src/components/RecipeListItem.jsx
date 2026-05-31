// RecipeListItem.jsx
export default function RecipeListItem({ recipe }) {
  return (
  // RecipeListItem.jsx
<li className="recipe-card">
  <h3>{recipe.title}</h3>
  <p>Cook time: {recipe.cookTime} min</p>
  <p>
    Category: {recipe.category} • Origin: {recipe.origin}
  </p>
  <a href={recipe.link} target="_blank" rel="noreferrer">
    View recipe
  </a>
</li>
  );
}
