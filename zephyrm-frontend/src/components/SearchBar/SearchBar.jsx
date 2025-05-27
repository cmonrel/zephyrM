/**
 * Search Bar Component
 *
 * This component represents a search bar for filtering and searching content.
 *
 * @module compponents/SearchBar/SearchBar
 */

import { useEffect, useState } from "react";
import "./SearchBar.css";
import { useDebounce } from "../../hooks";

/**
 * SearchBar Component
 *
 * This component renders an input field for users to enter search terms.
 * It utilizes a debouncing mechanism to limit the frequency of search
 * term updates, calling the provided onSearch callback with the debounced
 * and trimmed search term.
 *
 * @param {function} onSearch - Callback function to be called with the
 * debounced search term.
 * @param {string} [placeholder="Search..."] - Placeholder text for the
 * search input field.
 *
 * @returns {JSX.Element} The rendered search bar input element.
 */

export const SearchBar = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { debouncedValue } = useDebounce(searchTerm, 400);

  /**
   * Effect hook to call the onSearch callback with the debounced search term.
   *
   * @param {string} debouncedValue - The debounced search term.
   */
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
