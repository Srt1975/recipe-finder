export default function RecipeListItem({ recipe, onClick }) {
  return (
    <li className="recipe-card" onClick={onClick} tabIndex={0}>
      <h3>{recipe.name}</h3>
      <div className="recipe-meta">
        {recipe.category && <span className="badge category">{recipe.category}</span>}
        {recipe.origin && <span className="badge origin">{recipe.origin}</span>}
        {recipe.servings && <span className="badge servings">{recipe.servings} servings</span>}
      </div>
    </li>
  );
}
