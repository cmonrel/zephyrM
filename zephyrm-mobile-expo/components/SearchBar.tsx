import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { debouncedValue } = useDebounce(searchTerm, 400);

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
