import { useDispatch, useSelector } from "react-redux";

import {
  onCloseAssetModal,
  onCloseAssetsDetailsModal,
  onOpenAssetModal,
  onOpenAssetsDetailsModal,
} from "../../store/ui/uiSlice";

export const useUIStore = () => {
  const dispatch = useDispatch();
  const { isAssetDetailsModalOpen, isAssetModalOpen } = useSelector(
    (state: any) => state.ui
  );

  const openAssetModal = () => {
    dispatch(onOpenAssetModal());
  };

  const closeAssetModal = () => {
    dispatch(onCloseAssetModal());
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

    // Methods
    closeAssetModal,
    closeAssetsDetailsModal,
    openAssetModal,
    openAssetsDetailsModal,
  };
};
