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
    >
      <h2>Select State</h2>
      <div className="selection-list">
        <div
          key="free"
          className="selection-item"
          onClick={() => onSelect("free")}
        >
          <p>Free</p>
        </div>
        <div
          key="on loan"
          className="selection-item"
          onClick={() => onSelect("on loan")}
        >
          <p>On loan</p>
        </div>
        <div
          key="under maintenance"
          className="selection-item"
          onClick={() => onSelect("under maintenance")}
        >
          <p>Under maintenance</p>
        </div>
        <div
          key="broken"
          className="selection-item"
          onClick={() => onSelect("broken")}
        >
          <p>Broken</p>
        </div>
      </div>
    </Modal>
  );
};
