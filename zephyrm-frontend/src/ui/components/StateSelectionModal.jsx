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

export const StateSelectionModal = ({ onSelect }) => {
  const { isStateSelectionModalOpen, closeStateSelectionModal } = useUIStore();

  const onCloseModal = () => {
    closeStateSelectionModal();
  };

  return (
    <Modal
      isOpen={isStateSelectionModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="selection-modal"
      overlayClassName={"modal-fondo"}
    >
      <h2 className="selection-modal-title">Select State</h2>
      <div className="selection-list">
        <div
          key="free"
          className="selection-item"
          onClick={() => onSelect("Free")}
        >
          <p>Free</p>
        </div>
        <div
          key="on loan"
          className="selection-item"
          onClick={() => onSelect("On loan")}
        >
          <p>On loan</p>
        </div>
        <div
          key="under maintenance"
          className="selection-item"
          onClick={() => onSelect("Under maintenance")}
        >
          <p>Under maintenance</p>
        </div>
        <div
          key="broken"
          className="selection-item"
          onClick={() => onSelect("Broken")}
        >
          <p>Broken</p>
        </div>
      </div>
    </Modal>
  );
};
