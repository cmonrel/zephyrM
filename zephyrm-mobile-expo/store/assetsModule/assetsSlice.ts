/**
 * Assets slice
 *
 * @module store/assetsModule/assetsSlice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asset } from "../../interfaces";

interface AssetState {
  isLoadingAssets: boolean;
  assets: Asset[];
  activeAsset: Asset | null;
}

const initialState: AssetState = {
  isLoadingAssets: true,
  assets: [],
  activeAsset: null,
};

/**
 * This slice contains the state and reducers for the assets module.
 */
export const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    /**
     * Sets the assets list and sets isLoadingAssets to false.
     *
     * This reducer is used when the assets list is loaded from the server.
     * It receives the list of assets as a payload and sets the state
     * with that list. It also sets isLoadingAssets to false to
     * indicate that the assets have been loaded.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the list of assets.
     */
    onLoadAssets: (state, { payload = [] }: PayloadAction<Asset[]>) => {
      state.isLoadingAssets = false;
      state.assets = payload;
    },

    /**
     * Sets the active asset to the given asset.
     *
     * This reducer is used to update the currently active asset in the state.
     * It receives the asset object as a payload and sets it as the active asset.
     * If the payload is null, it clears the active asset.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the asset object or null.
     */
    onSetActiveAsset: (state, { payload }: PayloadAction<Asset | null>) => {
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
    onAddNewAsset: (state, { payload }: PayloadAction<Asset>) => {
      state.assets.push(payload);
      state.activeAsset = null;
    },

    /**
     * Updates an existing asset in the list of assets.
     *
     * This reducer is used when an asset is modified. It receives the updated
     * asset object as a payload, finds the asset with the matching aid in the
     * state, and replaces it with the updated asset. If no matching aid is found,
     * the asset remains unchanged.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the updated asset object.
     */
    onUpdateAsset: (state, { payload }: PayloadAction<Asset>) => {
      state.assets = state.assets.map((asset) => {
        if (asset.aid === payload.aid) return payload;
        return asset;
      });
    },

    /**
     * Deletes the active asset from the list of assets and sets the active asset to null.
     *
     * This reducer is used when the user deletes the active asset. It filters
     * the asset with the matching aid from the state and sets the active asset
     * to null. If no active asset is set, the state remains unchanged.
     *
     * @param {Object} state The current state of the reducer.
     */
    onDeleteAsset: (state) => {
      if (state.activeAsset) {
        state.assets = state.assets.filter(
          (asset) => asset.aid !== state.activeAsset?.aid
        );
        state.activeAsset = null;
      }
    },

    /**
     * Resets the assets state when the user logs out.
     *
     * This reducer is used when the user logs out. It resets the state
     * of the assets module to its initial value, setting isLoadingAssets
     * to false and clearing the list of assets, and sets the active asset
     * to null.
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
