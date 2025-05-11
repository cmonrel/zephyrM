import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isDateModalOpen: false,
    isUserModalOpen: false,
    isPasswordModalOpen: false,
    isAssetModalOpen: false,
    isAssignModalOpen: false,
    isAssetSelectionModalOpen: false,
    isUserSelectionModalOPen: false,
  },
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
  },
});

// Action creators are generated for each case reducer function
export const {
  onCloseAssetModal,
  onCloseAssetSelectionModal,
  onCloseAssignModal,
  onCloseDateModal,
  onClosePasswordModal,
  onCloseUserModal,
  onCloseUserSelectionModal,
  onOpenAssetModal,
  onOpenAssetSelectionModal,
  onOpenAssignModal,
  onOpenDateModal,
  onOpenPasswordModal,
  onOpenUserModal,
  onOpenUserSelectionModal,
} = uiSlice.actions;
