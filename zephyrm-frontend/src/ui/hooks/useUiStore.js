import { useDispatch, useSelector } from "react-redux";

import {
  onCloseAssetModal,
  onCloseAssetsDetailsModal,
  onCloseAssetSelectionModal,
  onCloseAssignModal,
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
  onOpenDateModal,
  onOpenPasswordModal,
  onOpenRoleSelectionModal,
  onOpenStateSelectionModal,
  onOpenUserModal,
  onOpenUserSelectionModal,
} from "../../store/ui/uiSlice";

export const useUIStore = () => {
  const dispatch = useDispatch();
  const {
    isAssetDetailsModalOpen,
    isAssetModalOpen,
    isAssetSelectionModalOpen,
    isAssignModalOpen,
    isDateModalOpen,
    isPasswordModalOpen,
    isRoleSelectionModalOpen,
    isStateSelectionModalOpen,
    isUserModalOpen,
    isUserSelectionModalOPen,
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

  const openRoleSelectionModal = () => {
    dispatch(onOpenRoleSelectionModal());
  };

  const closeRoleSelectionModal = () => {
    dispatch(onCloseRoleSelectionModal());
  };
  const openStateSelectionModal = () => {
    console.log("openStateSelectionModal");
    dispatch(onOpenStateSelectionModal());
  };

  const closeStateSelectionModal = () => {
    dispatch(onCloseStateSelectionModal());
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
    isRoleSelectionModalOpen,
    isStateSelectionModalOpen,

    // Methods
    closeAssetModal,
    closeAssetsDetailsModal,
    closeAssetSelectionModal,
    closeAssignModal,
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
    openDateModal,
    openPasswordModal,
    openRoleSelectionModal,
    openStateSelectionModal,
    openUserModal,
    openUserSelectionModal,
  };
};
