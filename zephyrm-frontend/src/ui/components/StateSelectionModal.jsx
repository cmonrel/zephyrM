/**
 * State Selection Modal Component
 *
 * This component displays a modal for selecting a state.
 *
 * @module ui/components/StateSelectionModal
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
 * Displays a modal for selecting a state.
 *
 * This component renders a modal with a list of states that can be selected:
 * - "Free"
 * - "On loan"
 * - "Under maintenance"
 * - "Broken"
 *
 * When a state is selected, the `onSelect` function is called with the
 * selected state as its argument.
 *
 * @param {function} onSelect - The function to call when a state is selected.
 * @returns {ReactElement} The rendered modal component.
 */
export const StateSelectionModal = ({ onSelect }) => {
  const { isStateSelectionModalOpen, closeStateSelectionModal } = useUIStore();

  /**
   * Closes the state selection modal.
   */
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
