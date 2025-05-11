import { useDispatch, useSelector } from "react-redux";

import {
  onCloseAssetModal,
  onCloseAssignModal,
  onCloseDateModal,
  onClosePasswordModal,
  onCloseUserModal,
  onOpenAssetModal,
  onOpenAssignModal,
  onOpenDateModal,
  onOpenPasswordModal,
  onOpenUserModal,
} from "../../store/ui/uiSlice";

export const useUIStore = () => {
  const dispatch = useDispatch();
  const {
    isDateModalOpen,
    isUserModalOpen,
    isPasswordModalOpen,
    isAssetModalOpen,
    isAssignModalOpen,
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

  return {
    // Properties
    isAssetModalOpen,
    isDateModalOpen,
    isPasswordModalOpen,
    isUserModalOpen,
    isAssignModalOpen,

    // Methods
    closeAssetModal,
    closeAssignModal,
    closeDateModal,
    closePasswordModal,
    closeUserModal,
    openAssetModal,
    openAssignModal,
    openDateModal,
    openPasswordModal,
    openUserModal,
  };
};
