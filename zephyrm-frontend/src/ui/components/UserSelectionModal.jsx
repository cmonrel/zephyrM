/**
 * User Selection Modal Component
 *
 * This component displays a modal for selecting a user.
 *
 * @module ui/components/UserSelectionModal
 */

import Modal from "react-modal";

import { useUsersStore } from "../../modules/users/hooks/useUsersStore";
import { useUIStore } from "../hooks/useUiStore";
import { useEffect, useState } from "react";
import { SearchBar } from "../../components";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-0%, -35%)",
  },
};

/**
 * Displays a modal for selecting a user.
 *
 * This component receives an `onSelect` function as a prop, which is called
 * when a user is selected. The modal displays a list of all users in the
 * system, with the option to search for a specific user by name or role.
 *
 * @param {function} onSelect The function to call when a user is selected.
 * @returns {ReactElement} The rendered modal component.
 */
export const UserSelectionModal = ({ onSelect }) => {
  const { isUserSelectionModalOPen, closeUserSelectionModal } = useUIStore();
  const { users } = useUsersStore();

  /**
   * Closes the user selection modal.
   */
  const onCloseModal = () => {
    closeUserSelectionModal();
  };

  const [filteredUsers, setFilteredUsers] = useState(users);

  /**
   * Handles the search for users by name or role.
   *
   * This function takes a search term as a string and filters the list of users
   * based on the search term. It does a case insensitive search on the following
   * properties of the user object:
   *
   * - `name`
   * - `role`
   *
   * If the search term is found in any of these properties, the user is
   * included in the filtered list. The filtered list is then set as the
   * new state of the component.
   *
   * @param {string} searchTerm The search term to filter the users by.
   */
  const handleUserSearch = (searchTerm) => {
    const result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(result);
  };

  /**
   * Sets the filtered users to the list of all users when the component mounts
   * or when the list of users changes.
   */
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <Modal
      isOpen={isUserSelectionModalOPen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="selection-modal"
      overlayClassName={"modal-fondo"}
    >
      <h2 className="selection-modal-title">Select User</h2>
      <SearchBar onSearch={handleUserSearch} placeholder="Search user..." />
      <div className="selection-list">
        {filteredUsers.map((user) => (
          <div
            key={user.uid}
            className="selection-item"
            onClick={() => onSelect(user)}
          >
            {user.name} ({user.role})
          </div>
        ))}
      </div>
    </Modal>
  );
};
