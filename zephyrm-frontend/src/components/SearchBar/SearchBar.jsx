import { useEffect, useState } from "react";
import "./SearchBar.css";
import { useDebounce } from "../../hooks";

export const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { debouncedValue } = useDebounce(searchTerm, 400);

  useEffect(() => {
    onSearch(debouncedValue.toLocaleLowerCase().trim());
  }, [debouncedValue]);

  return (
    <input
      type="text"
      placeholder={placeholder}
      className="search-bar"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
};
