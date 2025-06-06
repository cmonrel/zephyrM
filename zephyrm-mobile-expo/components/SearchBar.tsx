/**
 * SearchBar component
 *
 * @module components/SearchBar
 */

import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useDebounce } from "../hooks/useDebounce";

/**
 * A search bar component that performs a search operation when the user types
 * and presses enter.
 *
 * It uses the `useDebounce` hook to debounce the search operation, which is
 * called with the searched term as an argument.
 *
 * The component accepts the following props:
 * - `onSearch`: the search operation to be performed when the user presses
 *   enter. It takes a single string argument, which is the searched term.
 * - `placeholder`: the placeholder text to be displayed in the input field.
 *   Default is "Search...".
 *
 * @param {Object} props component props
 * @param {function} props.onSearch search operation to be performed
 * @param {string} [props.placeholder] placeholder text
 * @returns {JSX.Element} the search bar component
 */
export default function SearchBar({
  onSearch,
  placeholder = "Search...",
}: {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { debouncedValue } = useDebounce(searchTerm, 400);

  /**
   * Calls the `onSearch` function with the debounced search term.
   */
  useEffect(() => {
    onSearch(debouncedValue.toLocaleLowerCase().trim());
  }, [debouncedValue]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholderTextColor="#999"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#333",
  },
});
