import Modal from "react-modal";

import { useAssetsStore } from "../../modules/assetsModule";
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
    transform: "translate(-0%, -30%)",
  },
};

export const AssetSelectionModal = ({ onSelect }) => {
  const { isAssetSelectionModalOpen, closeAssetSelectionModal } = useUIStore();
  const { assets } = useAssetsStore();

  const onCloseModal = () => {
    closeAssetSelectionModal();
  };

  const [filteredAssets, setFilteredAssets] = useState(assets);

  const handleAssetSearch = (searchTerm) => {
    const result = assets.filter(
      (asset) =>
        asset.title.toLocaleLowerCase().includes(searchTerm) ||
        asset.category.toLocaleLowerCase().includes(searchTerm)
    );
    setFilteredAssets(result);
  };

  useEffect(() => {
    setFilteredAssets(assets);
  }, [assets]);

  return (
    <Modal
      isOpen={isAssetSelectionModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="selection-modal"
      overlayClassName={"modal-fondo"}
    >
      <h2 className="selection-modal-title">Select Asset</h2>
      <SearchBar onSearch={handleAssetSearch} placeholder="Search asset..." />
      <div className="selection-list">
        {filteredAssets.map((asset) => (
          <div
            key={asset.aid}
            className="selection-item"
            onClick={() => onSelect(asset)}
          >
            {asset.title} ({asset.category})
            <div className="asset-state">{asset.state}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
