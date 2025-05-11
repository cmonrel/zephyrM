import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isDateModalOpen: false,
    isUserModalOpen: false,
    isPasswordModalOpen: false,
    isAssetModalOpen: false,
    isAssignModalOpen: false,
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
  },
});

// Action creators are generated for each case reducer function
export const {
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
} = uiSlice.actions;
