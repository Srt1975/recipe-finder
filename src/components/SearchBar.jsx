// SearchBar.jsx
export default function SearchBar({ searchText, onSearchTextChange, onSubmitSearch }) {
  function handleChange(event) {
    onSearchTextChange(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmitSearch();
  }

  return (
    // SearchBar.jsx
<form className="search-form" onSubmit={handleSubmit}>
  <label htmlFor="search">Search recipes</label>
  <input
    id="search"
    type="text"
    placeholder="Title, ingredient, category, or origin"
    value={searchText}
    onChange={handleChange}
  />
  <button type="submit">Search</button>
</form>
  );
}