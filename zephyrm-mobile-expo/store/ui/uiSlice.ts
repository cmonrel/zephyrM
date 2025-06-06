/**
 * UI slice
 *
 * @module store/ui/uiSlice
 */

import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isAssetDetailsModalOpen: boolean;
  isAssetModalOpen: boolean;
  isAssetSelectionModalOpen: boolean;
  isUserSelectionModalOpen: boolean;
  isCreatingModalOpen: boolean;
}

const initialState: UiState = {
  isAssetDetailsModalOpen: false,
  isAssetModalOpen: false,
  isAssetSelectionModalOpen: false,
  isUserSelectionModalOpen: false,
  isCreatingModalOpen: false,
};

/**
 * This slice defines the state and actions for the UI module in the Redux store.
 */
export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    /**
     * Opens the asset creation modal.
     *
     * @remarks
     * Sets isAssetModalOpen to true in the state.
     */
    onOpenAssetModal: (state) => {
      state.isAssetModalOpen = true;
    },

    /**
     * Closes the asset creation modal.
     *
     * @remarks
     * Sets isAssetModalOpen to false in the state.
     */
    onCloseAssetModal: (state) => {
      state.isAssetModalOpen = false;
    },

    /**
     * Opens the asset selection modal.
     *
     * @remarks
     * Sets isAssetSelectionModalOpen to true in the state.
     */
    onOpenAssetSelectionModal: (state) => {
      state.isAssetSelectionModalOpen = true;
    },

    /**
     * Closes the asset selection modal.
     *
     * @remarks
     * Sets isAssetSelectionModalOpen to false in the state.
     */
    onCloseAssetSelectionModal: (state) => {
      state.isAssetSelectionModalOpen = false;
    },

    /**
     * Opens the user selection modal.
     *
     * @remarks
     * Sets isUserSelectionModalOpen to true in the state.
     */
    onOpenUserSelectionModal: (state) => {
      state.isUserSelectionModalOpen = true;
    },

    /**
     * Closes the user selection modal.
     *
     * @remarks
     * Sets isUserSelectionModalOpen to false in the state.
     */
    onCloseUserSelectionModal: (state) => {
      state.isUserSelectionModalOpen = false;
    },

    /**
     * Opens the asset details modal.
     *
     * @remarks
     * Sets isAssetDetailsModalOpen to true in the state.
     */
    onOpenAssetsDetailsModal: (state) => {
      state.isAssetDetailsModalOpen = true;
    },

    /**
     * Closes the asset details modal.
     *
     * @remarks
     * Sets isAssetDetailsModalOpen to false in the state.
     */
    onCloseAssetsDetailsModal: (state) => {
      state.isAssetDetailsModalOpen = false;
    },

    /**
     * Opens the creation asset modal.
     *
     * @remarks
     * Sets isCreatingModalOpen to true in the state.
     */
    onOpenCreatingModal: (state) => {
      state.isCreatingModalOpen = true;
    },

    /**
     * Closes the creation asset modal.
     *
     * @remarks
     * Sets isCreatingModalOpen to false in the state.
     */
    onCloseCreatingModal: (state) => {
      state.isCreatingModalOpen = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
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
} = uiSlice.actions;
