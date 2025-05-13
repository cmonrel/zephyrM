import { useDispatch, useSelector } from "react-redux";

import {
  onCloseAssetModal,
  onCloseAssetsDetailsModal,
  onCloseAssetSelectionModal,
  onCloseAssignModal,
  onCloseDateModal,
  onClosePasswordModal,
  onCloseUserModal,
  onCloseUserSelectionModal,
  onOpenAssetModal,
  onOpenAssetsDetailsModal,
  onOpenAssetSelectionModal,
  onOpenAssignModal,
  onOpenDateModal,
  onOpenPasswordModal,
  onOpenUserModal,
  onOpenUserSelectionModal,
} from "../../store/ui/uiSlice";

export const useUIStore = () => {
  const dispatch = useDispatch();
  const {
    isAssetModalOpen,
    isAssetSelectionModalOpen,
    isAssignModalOpen,
    isDateModalOpen,
    isPasswordModalOpen,
    isUserModalOpen,
    isUserSelectionModalOPen,
    isAssetDetailsModalOpen,
  } = useSelector((state) => state.ui);

  const openDateModal = () => {
    dispatch(onOpenDateModal());
  };

  const closeDateModal = () => {
    dispatch(onCloseDateModal());
  };

  const openUserModal = () => {
    dispatch(onOpenUserModal());
  };

  const closeUserModal = () => {
    dispatch(onCloseUserModal());
  };

  const openPasswordModal = () => {
    dispatch(onOpenPasswordModal());
  };

  const closePasswordModal = () => {
    dispatch(onClosePasswordModal());
  };
  const openAssetModal = () => {
    dispatch(onOpenAssetModal());
  };

  const closeAssetModal = () => {
    dispatch(onCloseAssetModal());
  };
  const openAssignModal = () => {
    dispatch(onOpenAssignModal());
  };

  const closeAssignModal = () => {
    dispatch(onCloseAssignModal());
  };

  const openAssetSelectionModal = () => {
    dispatch(onOpenAssetSelectionModal());
  };

  const closeAssetSelectionModal = () => {
    dispatch(onCloseAssetSelectionModal());
  };

  const openUserSelectionModal = () => {
    dispatch(onOpenUserSelectionModal());
  };

  const closeUserSelectionModal = () => {
    dispatch(onCloseUserSelectionModal());
  };

  const openAssetsDetailsModal = () => {
    dispatch(onOpenAssetsDetailsModal());
  };

  const closeAssetsDetailsModal = () => {
    dispatch(onCloseAssetsDetailsModal());
  };

  return {
    // Properties
    isAssetDetailsModalOpen,
    isAssetModalOpen,
    isAssetSelectionModalOpen,
    isAssignModalOpen,
    isDateModalOpen,
    isPasswordModalOpen,
    isUserModalOpen,
    isUserSelectionModalOPen,

    // Methods
    closeAssetModal,
    closeAssetsDetailsModal,
    closeAssetSelectionModal,
    closeAssignModal,
    closeDateModal,
    closePasswordModal,
    closeUserModal,
    closeUserSelectionModal,
    openAssetModal,
    openAssetsDetailsModal,
    openAssetSelectionModal,
    openAssignModal,
    openDateModal,
    openPasswordModal,
    openUserModal,
    openUserSelectionModal,
  };
};
