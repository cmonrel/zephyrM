/**
 * UI store hook
 *
 * @module hooks/ui/useUiStore
 */

import { useDispatch, useSelector } from "react-redux";

import {
  onCloseAssetModal,
  onCloseAssetsDetailsModal,
  onCloseAssetSelectionModal,
  onCloseCreatingModal,
  onCloseUserSelectionModal,
  onOpenAssetModal,
  onOpenAssetsDetailsModal,
  onOpenAssetSelectionModal,
  onOpenCreatingModal,
  onOpenUserSelectionModal,
} from "../../store/ui/uiSlice";

/**
 * Hook to interact with the UI store.
 *
 * @function useUIStore
 * @returns An object with the following properties:
 *
 * - `isAssetDetailsModalOpen`: Whether the asset details modal is open.
 * - `isAssetModalOpen`: Whether the asset creation modal is open.
 * - `isAssetSelectionModalOpen`: Whether the asset selection modal is open.
 * - `isUserSelectionModalOpen`: Whether the user selection modal is open.
 * - `isCreatingModalOpen`: Whether the creating asset modal is open.
 *
 * And the following methods:
 *
 * - `closeAssetModal`: Close the asset creation modal.
 * - `closeAssetsDetailsModal`: Close the asset details modal.
 * - `closeAssetSelectionModal`: Close the asset selection modal.
 * - `closeCreatingModal`: Close the creating asset modal.
 * - `closeUserSelectionModal`: Close the user selection modal.
 * - `openAssetModal`: Open the asset creation modal.
 * - `openAssetsDetailsModal`: Open the asset details modal.
 * - `openAssetSelectionModal`: Open the asset selection modal.
 * - `openCreatingModal`: Open the creating asset modal.
 * - `openUserSelectionModal`: Open the user selection modal.
 */
export const useUIStore = () => {
  const dispatch = useDispatch();
  const {
    isAssetDetailsModalOpen,
    isAssetModalOpen,
    isAssetSelectionModalOpen,
    isUserSelectionModalOpen,
    isCreatingModalOpen,
  } = useSelector((state: any) => state.ui);

  /**
   * Opens the asset creation modal.
   */
  const openAssetModal = () => {
    dispatch(onOpenAssetModal());
  };

  /**
   * Closes the asset creation modal.
   */
  const closeAssetModal = () => {
    dispatch(onCloseAssetModal());
  };

  /**
   * Opens the asset details modal.
   */
  const openAssetsDetailsModal = () => {
    dispatch(onOpenAssetsDetailsModal());
  };

  /**
   * Closes the asset details modal.
   */
  const closeAssetsDetailsModal = () => {
    dispatch(onCloseAssetsDetailsModal());
  };

  /**
   * Opens the asset selection modal.
   */
  const openAssetSelectionModal = () => {
    dispatch(onOpenAssetSelectionModal());
  };

  /**
   * Closes the asset selection modal.
   */
  const closeAssetSelectionModal = () => {
    dispatch(onCloseAssetSelectionModal());
  };

  /**
   * Opens the user selection modal.
   */
  const openUserSelectionModal = () => {
    dispatch(onOpenUserSelectionModal());
  };

  /**
   * Closes the user selection modal.
   */
  const closeUserSelectionModal = () => {
    dispatch(onCloseUserSelectionModal());
  };

  /**
   * Opens the creation asset modal.
   */
  const openCreatingModal = () => {
    dispatch(onOpenCreatingModal());
  };

  /**
   * Closes the creation asset modal.
   */
  const closeCreatingModal = () => {
    dispatch(onCloseCreatingModal());
  };

  return {
    // Properties
    isAssetDetailsModalOpen,
    isAssetModalOpen,
    isAssetSelectionModalOpen,
    isUserSelectionModalOpen,
    isCreatingModalOpen,

    // Methods
    closeAssetModal,
    closeAssetsDetailsModal,
    closeAssetSelectionModal,
    closeCreatingModal,
    closeUserSelectionModal,
    openAssetModal,
    openAssetsDetailsModal,
    openAssetSelectionModal,
    openCreatingModal,
    openUserSelectionModal,
  };
};
