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

export const UserSelectionModal = ({ onSelect }) => {
  const { isUserSelectionModalOPen, closeUserSelectionModal } = useUIStore();
  const { users } = useUsersStore();

  const onCloseModal = () => {
    closeUserSelectionModal();
  };

  const [filteredUsers, setFilteredUsers] = useState(users);

  const handleUserSearch = (searchTerm) => {
    const result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    setFilteredUsers(result);
  };

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <Modal
      isOpen={isUserSelectionModalOPen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="selection-modal"
    >
      <h2>Select User</h2>
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
