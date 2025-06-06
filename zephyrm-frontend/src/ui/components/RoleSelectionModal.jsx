/**
 * Role Selection Modal Component
 *
 * This component displays a modal for selecting a role.
 *
 * @module ui/components/RoleSelectionModal
 */

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

/**
 * Displays a modal for selecting a user role.
 *
 * This component renders a modal with a list of roles that can be selected:
 * - "Admin"
 * - "Worker"
 *
 * When a role is selected, the `onSelect` function is called with the
 * selected role as its argument.
 *
 * @param {function} onSelect - The function to call when a role is selected.
 * @returns {ReactElement} The rendered modal component.
 */
export const RoleSelectionModal = ({ onSelect }) => {
  const { isRoleSelectionModalOpen, closeRoleSelectionModal } = useUIStore();

  /**
   * Closes the role selection modal.
   */
  const onCloseModal = () => {
    closeRoleSelectionModal();
  };

  return (
    <Modal
      isOpen={isRoleSelectionModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="selection-modal"
      overlayClassName={"modal-fondo"}
    >
      <h2>Select Role</h2>
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
