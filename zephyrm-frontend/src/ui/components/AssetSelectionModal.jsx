/**
 * Asset Selection Modal Component
 *
 * This component displays a modal for selecting an asset.
 *
 * @module ui/components/AssetSelectionModal
 */

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

/**
 * Displays a modal for selecting an asset.
 *
 * This component renders a modal with a list of all assets in the system, with
 * the option to search for a specific asset by title or category. When an asset
 * is selected, the `onSelect` function is called with the selected asset as its
 * argument.
 *
 * @param {function} onSelect The function to call when an asset is selected.
 * @returns {ReactElement} The rendered modal component.
 */
export const AssetSelectionModal = ({ onSelect }) => {
  const { isAssetSelectionModalOpen, closeAssetSelectionModal } = useUIStore();
  const { assets } = useAssetsStore();

  /**
   * Closes the asset selection modal.
   */
  const onCloseModal = () => {
    closeAssetSelectionModal();
  };

  const [filteredAssets, setFilteredAssets] = useState(assets);

  /**
   * Handles the search for assets by title or category.
   *
   * This function takes a search term as a string and filters the list of assets
   * based on the search term. It does a case insensitive search on the following
   * properties of the asset object:
   *
   * - `title`
   * - `category`
   *
   * If the search term is found in any of these properties, the asset is
   * included in the filtered list. The filtered list is then set as the
   * new state of the component.
   *
   * @param {string} searchTerm The search term to filter the assets by.
   */
  const handleAssetSearch = (searchTerm) => {
    const result = assets.filter(
      (asset) =>
        asset.title.toLocaleLowerCase().includes(searchTerm) ||
        asset.category.toLocaleLowerCase().includes(searchTerm)
    );
    setFilteredAssets(result);
  };

  /**
   * Updates the filtered assets when the assets change.
   */
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
