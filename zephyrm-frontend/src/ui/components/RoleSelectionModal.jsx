import Modal from "react-modal";

import { useUIStore } from "../hooks/useUiStore";

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

export const RoleSelectionModal = ({ onSelect }) => {
  const { isRoleSelectionModalOpen, closeRoleSelectionModal } = useUIStore();

  const onCloseModal = () => {
    closeRoleSelectionModal();
  };

  return (
    <Modal
      isOpen={isRoleSelectionModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="selection-modal"
    >
      <h2>Select User</h2>
      <div className="selection-list">
        <div
          key="admin"
          className="selection-item"
          onClick={() => onSelect("admin")}
        >
          <p>Admin</p>
        </div>
        <div
          key="worker"
          className="selection-item"
          onClick={() => onSelect("worker")}
        >
          <p>Worker</p>
        </div>
      </div>
    </Modal>
  );
};
