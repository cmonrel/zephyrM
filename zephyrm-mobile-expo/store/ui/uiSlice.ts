import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isDateModalOpen: boolean;
  isUserModalOpen: boolean;
  isPasswordModalOpen: boolean;
  isAssetModalOpen: boolean;
  isAssignModalOpen: boolean;
  isAssetSelectionModalOpen: boolean;
  isUserSelectionModalOPen: boolean;
  isAssetDetailsModalOpen: boolean;
  isRoleSelectionModalOpen: boolean;
  isStateSelectionModalOpen: boolean;
}

const initialState: UiState = {
  isDateModalOpen: false,
  isUserModalOpen: false,
  isPasswordModalOpen: false,
  isAssetModalOpen: false,
  isAssignModalOpen: false,
  isAssetSelectionModalOpen: false,
  isUserSelectionModalOPen: false,
  isAssetDetailsModalOpen: false,
  isRoleSelectionModalOpen: false,
  isStateSelectionModalOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    onOpenDateModal: (state) => {
      state.isDateModalOpen = true;
    },
    onCloseDateModal: (state) => {
      state.isDateModalOpen = false;
    },
    onOpenUserModal: (state) => {
      state.isUserModalOpen = true;
    },
    onCloseUserModal: (state) => {
      state.isUserModalOpen = false;
    },
    onOpenPasswordModal: (state) => {
      state.isPasswordModalOpen = true;
    },
    onClosePasswordModal: (state) => {
      state.isPasswordModalOpen = false;
    },
    onOpenAssetModal: (state) => {
      state.isAssetModalOpen = true;
    },
    onCloseAssetModal: (state) => {
      state.isAssetModalOpen = false;
    },
    onOpenAssignModal: (state) => {
      state.isAssignModalOpen = true;
    },
    onCloseAssignModal: (state) => {
      state.isAssignModalOpen = false;
    },
    onOpenAssetSelectionModal: (state) => {
      state.isAssetSelectionModalOpen = true;
    },
    onCloseAssetSelectionModal: (state) => {
      state.isAssetSelectionModalOpen = false;
    },
    onOpenUserSelectionModal: (state) => {
      state.isUserSelectionModalOPen = true;
    },
    onCloseUserSelectionModal: (state) => {
      state.isUserSelectionModalOPen = false;
    },
    onOpenAssetsDetailsModal: (state) => {
      state.isAssetDetailsModalOpen = true;
    },
    onCloseAssetsDetailsModal: (state) => {
      state.isAssetDetailsModalOpen = false;
    },
    onOpenRoleSelectionModal: (state) => {
      state.isRoleSelectionModalOpen = true;
    },
    onCloseRoleSelectionModal: (state) => {
      state.isRoleSelectionModalOpen = false;
    },
    onOpenStateSelectionModal: (state) => {
      console.log("onOpen");
      state.isStateSelectionModalOpen = true;
    },
    onCloseStateSelectionModal: (state) => {
      state.isStateSelectionModalOpen = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
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
} = uiSlice.actions;
