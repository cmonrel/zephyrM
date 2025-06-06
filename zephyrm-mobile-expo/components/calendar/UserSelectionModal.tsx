/**
 * UserSelectionModal component
 *
 * @module components/calendar/UserSelectionModal
 */

import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useUIStore } from "../../hooks/ui/useUiStore";
import { useUsersStore } from "../../hooks/users/useUsersStore";
import { User } from "../../interfaces/login/userInterface";
import SearchBar from "../SearchBar";

/**
 * Modal that shows a list of users. The user can search for specific users and
 * select one to return to the caller.
 *
 * @param onSelect - A callback function that takes the selected user as an
 *   argument.
 *
 * @returns A JSX element that renders a modal with a search bar at the top and a
 *   list of users below. When a user is selected, the modal is closed and the
 *   onSelect callback is called with the selected user as an argument.
 */
export const UserSelectionModal = ({
  onSelect,
}: {
  onSelect: (asset: any) => void;
}) => {
  const { isUserSelectionModalOpen, closeUserSelectionModal } = useUIStore();
  const { users } = useUsersStore();

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Filters the users based on the provided search term and updates the
   * filteredUsers state.
   *
   * The search is case-insensitive and matches any part of the text within the
   * user fields of name and role.
   *
   * @param {string} searchTerm - The term used to filter the users.
   */
  const handleUserSearch = (text: string) => {
    setSearchTerm(text);
    const term = text.toLowerCase();
    const result = users.filter(
      (user: User) =>
        user.name.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
    );
    setFilteredUsers(result);
  };

  /**
   * Closes the modal and calls the onSelect callback with the selected user as
   * an argument.
   *
   * @param {User} user - The selected user.
   */
  const handleSelect = (user: User) => {
    onSelect(user);
    closeUserSelectionModal();
  };

  /**
   * Updates the filtered users state when the users state changes.
   */
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <Modal visible={isUserSelectionModalOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Select User</Text>

          <SearchBar
            onSearch={handleUserSearch}
            placeholder="Search Asset..."
          />

          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleSelect(item)} style={styles.item}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemState}>{item.role}</Text>
              </Pressable>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <TouchableOpacity
            onPress={closeUserSelectionModal}
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
  itemState: {
    fontSize: 12,
    color: "#888",
  },
  closeBtn: {
    marginTop: 10,
    alignItems: "center",
  },
  closeText: {
    color: "red",
    fontWeight: "500",
  },
});
