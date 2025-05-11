import { useEffect } from "react";
import Modal from "react-modal";
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

export const AssignModal = () => {
  const { users, startLoadingUsers } = useUsersStore();
  const { isAssignModalOpen, closeAssignModal } = useUIStore();
  const { setActiveAsset, startAssigningUserToAsset } = useAssetsStore();

  const handleUserClick = ({ uid }) => {
    startAssigningUserToAsset(uid);
    closeAssignModal();
  };

  const handleButtonClick = () => {
    startAssigningUserToAsset(null);
    closeAssignModal();
  };

  const onCloseModal = () => {
    closeAssignModal();
    setActiveAsset(null);
  };

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
      <h2>Select a User</h2>
      <hr />
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
      <hr />
      <button
        onClick={() => handleButtonClick()}
        className="btn btn-outline-danger"
      >
        <i className="far fa-trash-alt"></i>
        <span> Clear</span>
      </button>
    </Modal>
  );
};
