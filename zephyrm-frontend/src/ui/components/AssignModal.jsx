/**
 * Assign User to Asset Modal Component
 *
 * This component displays a modal for assigning a user to an asset.
 *
 * @module ui/components/AssignModal
 */

import { useEffect } from "react";
import Modal from "react-modal";
import "./AssignModal.css";

import { useUsersStore } from "../../modules/users/hooks/useUsersStore";
import { useUIStore } from "../hooks/useUiStore";
import { useAssetsStore } from "../../modules/assetsModule";

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

/**
 * Assign Modal Component
 *
 * This component renders a modal for assigning users to assets. It displays a list of users
 * fetched from the server, allowing the selection of a user to be assigned to an active asset.
 * The modal also provides an option to clear the current assignment.
 *
 * @returns {ReactElement} A modal component that displays a list of users for assignment.
 */
export const AssignModal = () => {
  const { users, startLoadingUsers } = useUsersStore();
  const { isAssignModalOpen, closeAssignModal } = useUIStore();
  const { setActiveAsset, startAssigningUserToAsset } = useAssetsStore();

  /**
   * Handles a user click event in the modal.
   *
   * This function assigns the clicked user to the active asset and closes the modal.
   *
   * @param {{ uid: string }} user - The user object from the users list.
   */
  const handleUserClick = ({ uid }) => {
    startAssigningUserToAsset(uid);
    closeAssignModal();
  };

  /**
   * Handles the button click event to clear the current assignment.
   *
   * This function calls the function to clear the current assignment and
   * closes the assign modal.
   */
  const handleButtonClick = () => {
    startAssigningUserToAsset(null);
    closeAssignModal();
  };

  /**
   * Closes the assign modal and resets the active asset.
   */
  const onCloseModal = () => {
    closeAssignModal();
    setActiveAsset(null);
  };

  /**
   * Loads users when the component mounts.
   */
  useEffect(() => {
    startLoadingUsers();
  }, []);

  return (
    <Modal
      isOpen={isAssignModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={500}
    >
      <div className="modal-header">
        <h2>Select a User</h2>
      </div>

      <div className="modal-content">
        <div className="user-list-container">
          {users.map((user) => (
            <div
              key={user.uid}
              className="user-card"
              onClick={() => handleUserClick(user)}
            >
              <div className="user-info">
                <h3>{user.name}</h3>
                <div className="user-meta">
                  <span className="user-id">ID: {user.uid}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>
              <div className="user-select-indicator">
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-footer-assign pt-3">
        <button
          onClick={() => handleButtonClick()}
          className="btn btn-outline-danger"
        >
          <i className="far fa-trash-alt"></i>
          <span> Clear</span>
        </button>
      </div>
    </Modal>
  );
};
