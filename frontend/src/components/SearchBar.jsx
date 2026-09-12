import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar({
  initialValue = "",
  placeholder = "Search research, people, projects, publications, events and opportunities...",
  autoFocus = false,
}) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        autoFocus={autoFocus}
      />
      <button type="submit">Search</button>
    </form>
  );
}
