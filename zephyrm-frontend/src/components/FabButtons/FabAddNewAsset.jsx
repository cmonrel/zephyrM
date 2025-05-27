/**
 * FabAddNewAsset Component
 *
 * This component represents a floating action button (FAB) for adding new assets.
 *
 * @module components/FabButtons/FabAddNewAsset
 */

import { useUIStore } from "../../ui/hooks/useUiStore";
import { useAssetsStore } from "../../modules/assetsModule";

/**
 * Floating action button (FAB) component for adding new assets.
 *
 * This component renders a button that, when clicked, resets the active asset
 * to a default state and opens the asset modal for creating or editing assets.
 *
 * @function FabAddNewAsset
 * @returns {JSX.Element} The FAB component.
 */

export const FabAddNewAsset = () => {
  const { openAssetModal } = useUIStore();
  const { setActiveAsset } = useAssetsStore();

  /**
   * Handles the click event on the add new asset FAB.
   * Resets the active asset and opens the asset modal.
   */
  const handleClickNew = () => {
    setActiveAsset({
      title: "",
      category: "",
      description: "",
      acquisitionDate: new Date(),
      location: "",
      state: "",
    });

    openAssetModal();
  };
  return (
    <button className="btn btn-primary fab" onClick={() => handleClickNew()}>
      <i className="fas fa-plus"></i>
    </button>
  );
};
