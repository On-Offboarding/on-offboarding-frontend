import "./SearchBar.css";

function SearchBar({value, onChange, placeholder = "Sök efter namn...",}) {
  const handleChange = (e) => onChange(e.target.value);

  return (
    <div className="search-bar">
      <i className="fa fa-search" aria-hidden="true" />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        aria-label="Sök"
      />
    </div>
  );
}

export default SearchBar;
