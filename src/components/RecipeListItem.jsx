export default function RecipeListItem({ recipe, onClick }) {
  return (
    <li className="recipe-card" onClick={onClick} tabIndex={0} style={{cursor: "pointer"}}>
      <h3>{recipe.name}</h3>
      {/* <p>Cook time: {recipe.cookTime || "N/A"} min</p> */}
      <p>Category: {recipe.category} </p>
      <p>Origin: {recipe.origin || "N/A"} </p>
      {/* Remove the <a> if you don't have URLs yet */}
    </li>
  );
}
