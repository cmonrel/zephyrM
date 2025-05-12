import Modal from "react-modal";

import { useAssetsStore } from "../../modules/assetsModule";
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

export const AssetSelectionModal = ({ onSelect }) => {
  const { isAssetSelectionModalOpen, closeAssetSelectionModal } = useUIStore();
  const { assets } = useAssetsStore();

  const onCloseModal = () => {
    closeAssetSelectionModal();
  };

  return (
    <Modal
      isOpen={isAssetSelectionModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="selection-modal"
    >
      <h2>Select Asset</h2>
      <div className="selection-list">
        {assets.map((asset) => (
          <div
            key={asset.aid}
            className="selection-item"
            onClick={() => onSelect(asset)}
          >
            {asset.title} ({asset.category})
          </div>
        ))}
      </div>
    </Modal>
  );
};
