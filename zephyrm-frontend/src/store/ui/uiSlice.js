/**
 * UI slice
 *
 * This slice contains the state and reducers for the UI module.
 *
 * @module store/ui/uiSlice
 */

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
    isAssetDetailsModalOpen: false,
    isRoleSelectionModalOpen: false,
    isStateSelectionModalOpen: false,
  },
  reducers: {
    /**
     * Open the date modal.
     *
     * This reducer sets isDateModalOpen to true, which will open the date
     * modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onOpenDateModal: (state) => {
      state.isDateModalOpen = true;
    },
    /**
     * Close the date modal.
     *
     * This reducer sets isDateModalOpen to false, which will close the date
     * modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onCloseDateModal: (state) => {
      state.isDateModalOpen = false;
    },
    /**
     * Open the user modal.
     *
     * This reducer sets isUserModalOpen to true, which will open the user
     * modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onOpenUserModal: (state) => {
      state.isUserModalOpen = true;
    },
    /**
     * Close the user modal.
     *
     * This reducer sets isUserModalOpen to false, which will close the user
     * modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onCloseUserModal: (state) => {
      state.isUserModalOpen = false;
    },
    /**
     * Open the password modal.
     *
     * This reducer sets isPasswordModalOpen to true, which will open the password
     * modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onOpenPasswordModal: (state) => {
      state.isPasswordModalOpen = true;
    },
    /**
     * Close the password modal.
     *
     * This reducer sets isPasswordModalOpen to false, which will close the password
     * modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onClosePasswordModal: (state) => {
      state.isPasswordModalOpen = false;
    },
    /**
     * Open the asset modal.
     *
     * This reducer sets isAssetModalOpen to true, which will open the asset
     * modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onOpenAssetModal: (state) => {
      state.isAssetModalOpen = true;
    },
    /**
     * Close the asset modal.
     *
     * This reducer sets isAssetModalOpen to false, which will close the asset
     * modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onCloseAssetModal: (state) => {
      state.isAssetModalOpen = false;
    },
    /**
     * Open the assign modal.
     *
     * This reducer sets isAssignModalOpen to true, which will open the assign
     * modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onOpenAssignModal: (state) => {
      state.isAssignModalOpen = true;
    },
    /**
     * Close the assign modal.
     *
     * This reducer sets isAssignModalOpen to false, which will close the assign
     * modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onCloseAssignModal: (state) => {
      state.isAssignModalOpen = false;
    },
    /**
     * Open the asset selection modal.
     *
     * This reducer sets isAssetSelectionModalOpen to true, which will open the asset
     * selection modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onOpenAssetSelectionModal: (state) => {
      state.isAssetSelectionModalOpen = true;
    },
    /**
     * Close the asset selection modal.
     *
     * This reducer sets isAssetSelectionModalOpen to false, which will close the asset
     * selection modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onCloseAssetSelectionModal: (state) => {
      state.isAssetSelectionModalOpen = false;
    },
    /**
     * Open the user selection modal.
     *
     * This reducer sets isUserSelectionModalOpen to true, which will open the user
     * selection modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onOpenUserSelectionModal: (state) => {
      state.isUserSelectionModalOPen = true;
    },
    /**
     * Close the user selection modal.
     *
     * This reducer sets isUserSelectionModalOpen to false, which will close the user
     * selection modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onCloseUserSelectionModal: (state) => {
      state.isUserSelectionModalOPen = false;
    },
    /**
     * Open the asset details modal.
     *
     * This reducer sets isAssetDetailsModalOpen to true, which will open the asset
     * details modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onOpenAssetsDetailsModal: (state) => {
      state.isAssetDetailsModalOpen = true;
    },
    /**
     * Close the asset details modal.
     *
     * This reducer sets isAssetDetailsModalOpen to false, which will close
     * the asset details modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onCloseAssetsDetailsModal: (state) => {
      state.isAssetDetailsModalOpen = false;
    },
    /**
     * Open the role selection modal.
     *
     * This reducer sets isRoleSelectionModalOpen to true, which will open the role
     * selection modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onOpenRoleSelectionModal: (state) => {
      state.isRoleSelectionModalOpen = true;
    },
    /**
     * Close the role selection modal.
     *
     * This reducer sets isRoleSelectionModalOpen to false, which will close
     * the role selection modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onCloseRoleSelectionModal: (state) => {
      state.isRoleSelectionModalOpen = false;
    },
    /**
     * Open the state selection modal.
     *
     * This reducer sets isStateSelectionModalOpen to true, which will open the state
     * selection modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
    onOpenStateSelectionModal: (state) => {
      state.isStateSelectionModalOpen = true;
    },
    /**
     * Close the state selection modal.
     *
     * This reducer sets isStateSelectionModalOpen to false, which will close
     * the state selection modal in the UI.
     *
     * @param {Object} state The current state of the reducer.
     */
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
