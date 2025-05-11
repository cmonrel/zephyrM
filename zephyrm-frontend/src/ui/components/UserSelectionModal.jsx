import Modal from "react-modal";

import { useUsersStore } from "../../modules/users/hooks/useUsersStore";
import { useUIStore } from "../hooks/useUiStore";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export const UserSelectionModal = ({ onSelect }) => {
  const { isUserSelectionModalOPen, closeUserSelectionModal } = useUIStore();
  const { users } = useUsersStore();

  const onCloseModal = () => {
    closeUserSelectionModal();
  };

  return (
    <Modal
      isOpen={isUserSelectionModalOPen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="selection-modal"
    >
      <h2>Select User</h2>
      <div className="selection-list">
        {users.map((user) => (
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
