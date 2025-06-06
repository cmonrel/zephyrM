/**
 * UI store hook
 *
 * Custom hook for managing UI state within the application
 *
 * @module ui/hooks/useUiStore
 */

import { useDispatch, useSelector } from "react-redux";

import {
  onCloseAssetModal,
  onCloseAssetsDetailsModal,
  onCloseAssetSelectionModal,
  onCloseAssignModal,
  onCloseCategorySelectionModal,
  onCloseDateModal,
  onClosePasswordModal,
  onCloseRoleSelectionModal,
  onCloseStateSelectionModal,
  onCloseUserModal,
  onCloseUserSelectionModal,
  onOpenAssetModal,
  onOpenAssetsDetailsModal,
  onOpenAssetSelectionModal,
  onOpenAssignModal,
  onOpenCategorySelectionModal,
  onOpenDateModal,
  onOpenPasswordModal,
  onOpenRoleSelectionModal,
  onOpenStateSelectionModal,
  onOpenUserModal,
  onOpenUserSelectionModal,
} from "../../store/ui/uiSlice";

/**
 * UI store hook
 *
 * Custom hook for managing UI state within the application. This hook returns
 * an object with the following properties and methods:
 *
 * Properties:
 *
 * - `isAssetDetailsModalOpen`: boolean indicating whether the asset details modal
 *   is open
 * - `isAssetModalOpen`: boolean indicating whether the asset modal is open
 * - `isAssetSelectionModalOpen`: boolean indicating whether the asset selection
 *   modal is open
 * - `isAssignModalOpen`: boolean indicating whether the assign modal is open
 * - `isDateModalOpen`: boolean indicating whether the date modal is open
 * - `isPasswordModalOpen`: boolean indicating whether the password modal is open
 * - `isUserModalOpen`: boolean indicating whether the user modal is open
 * - `isUserSelectionModalOPen`: boolean indicating whether the user selection
 *   modal is open
 * - `isRoleSelectionModalOpen`: boolean indicating whether the role selection
 *   modal is open
 * - `isStateSelectionModalOpen`: boolean indicating whether the state selection
 *   modal is open
 * - `isCategorySelectionModalOpen`: boolean indicating whether the category
 *   selection modal is open
 *
 * Methods:
 *
 * - `closeAssetModal`: function to close the asset modal
 * - `closeAssetsDetailsModal`: function to close the asset details modal
 * - `closeAssetSelectionModal`: function to close the asset selection modal
 * - `closeAssignModal`: function to close the assign modal
 * - `closeCategorySelectionModal`: function to close the category selection modal
 * - `closeDateModal`: function to close the date modal
 * - `closePasswordModal`: function to close the password modal
 * - `closeRoleSelectionModal`: function to close the role selection modal
 * - `closeStateSelectionModal`: function to close the state selection modal
 * - `closeUserModal`: function to close the user modal
 * - `closeUserSelectionModal`: function to close the user selection modal
 * - `openAssetModal`: function to open the asset modal
 * - `openAssetsDetailsModal`: function to open the asset details modal
 * - `openAssetSelectionModal`: function to open the asset selection modal
 * - `openAssignModal`: function to open the assign modal
 * - `openCategorySelectionModal`: function to open the category selection modal
 * - `openDateModal`: function to open the date modal
 * - `openPasswordModal`: function to open the password modal
 * - `openRoleSelectionModal`: function to open the role selection modal
 * - `openStateSelectionModal`: function to open the state selection modal
 * - `openUserModal`: function to open the user modal
 * - `openUserSelectionModal`: function to open the user selection modal
 *
 * @returns {Object} an object with the specified properties and methods
 */
export const useUIStore = () => {
  const dispatch = useDispatch();
  const {
    isAssetDetailsModalOpen,
    isAssetModalOpen,
    isAssetSelectionModalOpen,
    isAssignModalOpen,
    isCategorySelectionModalOpen,
    isDateModalOpen,
    isPasswordModalOpen,
    isRoleSelectionModalOpen,
    isStateSelectionModalOpen,
    isUserModalOpen,
    isUserSelectionModalOPen,
  } = useSelector((state) => state.ui);

  /**
   * Opens the date modal.
   *
   * This method dispatches an action to open the date modal in the UI.
   */
  const openDateModal = () => {
    dispatch(onOpenDateModal());
  };

  /**
   * Closes the date modal.
   *
   * This method dispatches an action to close the date modal in the UI.
   */
  const closeDateModal = () => {
    dispatch(onCloseDateModal());
  };

  /**
   * Opens the user modal.
   *
   * This method dispatches an action to open the user modal in the UI.
   */
  const openUserModal = () => {
    dispatch(onOpenUserModal());
  };

  /**
   * Closes the user modal.
   *
   * This method dispatches an action to close the user modal in the UI.
   */
  const closeUserModal = () => {
    dispatch(onCloseUserModal());
  };

  /**
   * Opens the password modal.
   *
   * This method dispatches an action to open the password modal in the UI.
   */
  const openPasswordModal = () => {
    dispatch(onOpenPasswordModal());
  };

  /**
   * Closes the password modal.
   *
   * This method dispatches an action to close the password modal in the UI.
   */
  const closePasswordModal = () => {
    dispatch(onClosePasswordModal());
  };

  /**
   * Opens the asset modal.
   *
   * This method dispatches an action to open the asset modal in the UI.
   */
  const openAssetModal = () => {
    dispatch(onOpenAssetModal());
  };

  /**
   * Closes the asset modal.
   *
   * This method dispatches an action to close the asset modal in the UI.
   */
  const closeAssetModal = () => {
    dispatch(onCloseAssetModal());
  };

  /**
   * Opens the assign modal.
   *
   * This method dispatches an action to open the assign modal in the UI.
   */
  const openAssignModal = () => {
    dispatch(onOpenAssignModal());
  };

  /**
   * Closes the assign modal.
   *
   * This method dispatches an action to close the assign modal in the UI.
   */
  const closeAssignModal = () => {
    dispatch(onCloseAssignModal());
  };

  /**
   * Opens the asset selection modal.
   *
   * This method dispatches an action to open the asset selection modal in the UI.
   */
  const openAssetSelectionModal = () => {
    dispatch(onOpenAssetSelectionModal());
  };

  /**
   * Closes the asset selection modal.
   *
   * This method dispatches an action to close the asset selection modal in the UI.
   */
  const closeAssetSelectionModal = () => {
    dispatch(onCloseAssetSelectionModal());
  };

  /**
   * Opens the user selection modal.
   *
   * This method dispatches an action to open the user selection modal in the UI.
   */
  const openUserSelectionModal = () => {
    dispatch(onOpenUserSelectionModal());
  };

  /**
   * Closes the user selection modal.
   *
   * This method dispatches an action to close the user selection modal in the UI.
   */
  const closeUserSelectionModal = () => {
    dispatch(onCloseUserSelectionModal());
  };

  /**
   * Opens the assets details modal.
   *
   * This method dispatches an action to open the assets details modal in the UI.
   */
  const openAssetsDetailsModal = () => {
    dispatch(onOpenAssetsDetailsModal());
  };

  /**
   * Closes the assets details modal.
   *
   * This method dispatches an action to close the assets details modal in the UI.
   */
  const closeAssetsDetailsModal = () => {
    dispatch(onCloseAssetsDetailsModal());
  };

  /**
   * Opens the role selection modal.
   *
   * This method dispatches an action to open the role selection modal in the UI.
   */
  const openRoleSelectionModal = () => {
    dispatch(onOpenRoleSelectionModal());
  };

  /**
   * Closes the role selection modal.
   *
   * This method dispatches an action to close the role selection modal in the UI.
   */
  const closeRoleSelectionModal = () => {
    dispatch(onCloseRoleSelectionModal());
  };

  /**
   * Opens the state selection modal.
   *
   * This method dispatches an action to open the state selection modal in the UI.
   */
  const openStateSelectionModal = () => {
    dispatch(onOpenStateSelectionModal());
  };

  /**
   * Closes the state selection modal.
   *
   * This method dispatches an action to close the state selection modal in the UI.
   */
  const closeStateSelectionModal = () => {
    dispatch(onCloseStateSelectionModal());
  };

  /**
   * Opens the category selection modal.
   *
   * This method dispatches an action to open the category selection modal in the UI.
   */
  const openCategorySelectionModal = () => {
    dispatch(onOpenCategorySelectionModal());
  };

  /**
   * Closes the category selection modal.
   *
   * This method dispatches an action to close the category selection modal in the UI.
   */
  const closeCategorySelectionModal = () => {
    dispatch(onCloseCategorySelectionModal());
  };

  return {
    // Properties
    isAssetDetailsModalOpen,
    isAssetModalOpen,
    isAssetSelectionModalOpen,
    isAssignModalOpen,
    isCategorySelectionModalOpen,
    isDateModalOpen,
    isPasswordModalOpen,
    isUserModalOpen,
    isUserSelectionModalOPen,
    isRoleSelectionModalOpen,
    isStateSelectionModalOpen,

    // Methods
    closeAssetModal,
    closeAssetsDetailsModal,
    closeAssetSelectionModal,
    closeAssignModal,
    closeCategorySelectionModal,
    closeDateModal,
    closePasswordModal,
    closeRoleSelectionModal,
    closeStateSelectionModal,
    closeUserModal,
    closeUserSelectionModal,
    openAssetModal,
    openAssetsDetailsModal,
    openAssetSelectionModal,
    openAssignModal,
    openCategorySelectionModal,
    openDateModal,
    openPasswordModal,
    openRoleSelectionModal,
    openStateSelectionModal,
    openUserModal,
    openUserSelectionModal,
  };
};
