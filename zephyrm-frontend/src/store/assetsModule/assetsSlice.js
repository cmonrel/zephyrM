/**
 * Assets slice
 *
 * This slice contains the state and reducers for the assets module.
 *
 * @module store/assetsModule/assetsSlice
 */

import { createSlice } from "@reduxjs/toolkit";

export const assetsSlice = createSlice({
  name: "assets",
  initialState: {
    isLoadingAssets: true,
    assets: [],
    activeAsset: null,
  },
  reducers: {
    /**
     * Sets the assets list and sets isLoadingAssets to false.
     *
     * This reducer is used when the assets list is loaded from the server.
     * It receives the list of assets as a payload and sets the state
     * with that list.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the list of assets.
     */
    onLoadAssets: (state, { payload }) => {
      state.isLoadingAssets = false;
      state.assets = payload;
    },
    /**
     * Sets the active asset to the given asset.
     *
     * This reducer is used when a user clicks on an asset in the list.
     * It receives the asset object as a payload and sets the state
     * with that asset.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the asset object.
     */
    onSetActiveAsset: (state, { payload }) => {
      state.activeAsset = payload;
    },
    /**
     * Adds a new asset to the list of assets and sets the active asset to null.
     *
     * This reducer is used when a new asset is created. It receives the new
     * asset object as a payload and adds it to the list of assets in the state.
     * It also sets the active asset to null.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the new asset object.
     */
    onAddNewAsset: (state, { payload }) => {
      state.assets.push(payload);
      state.activeAsset = null;
    },
    /**
     * Updates an existing asset in the list of assets.
     *
     * This reducer is used when an asset is updated. It receives the updated
     * asset object as a payload and updates the list of assets in the state
     * with the new asset.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the updated asset object.
     */
    onUpdateAsset: (state, { payload }) => {
      state.assets = state.assets.map((asset) => {
        if (asset.aid === payload.aid) return payload;
        return asset;
      });
    },
    /**
     * Deletes an asset from the list of assets and sets the active asset to null.
     *
     * This reducer is used when an asset is deleted. It receives no payload and
     * deletes the active asset from the list of assets in the state and sets
     * the active asset to null.
     *
     * @param {Object} state The current state of the reducer.
     */
    onDeleteAsset: (state) => {
      if (state.activeAsset) {
        state.assets = state.assets.filter(
          (asset) => asset.id !== state.activeAsset.id
        );
        state.activeAsset = null;
      }
    },
    /**
     * Resets the assets state upon logout.
     *
     * This reducer is used when a user logs out of the application.
     * It clears the list of assets, sets the active asset to null,
     * and marks isLoadingAssets as false, indicating that no assets
     * are being loaded.
     *
     * @param {Object} state The current state of the reducer.
     */
    onLogoutAssets: (state) => {
      state.isLoadingAssets = false;
      state.assets = [];
      state.activeAsset = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onAddNewAsset,
  onDeleteAsset,
  onLoadAssets,
  onLogoutAssets,
  onSetActiveAsset,
  onUpdateAsset,
} = assetsSlice.actions;
