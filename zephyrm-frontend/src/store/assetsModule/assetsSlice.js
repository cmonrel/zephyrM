import { createSlice } from "@reduxjs/toolkit";
export const assetsSlice = createSlice({
  name: "assets",
  initialState: {
    isLoadingAssets: true,
    assets: [],
    activeAsset: null,
  },
  reducers: {
    onLoadAssets: (state, { payload }) => {
      state.isLoadingAssets = false;
      state.assets = payload;
    },
    onSetActiveAsset: (state, { payload }) => {
      state.activeAsset = payload;
    },
    onAddNewAsset: (state, { payload }) => {
      state.assets.push(payload);
      state.activeAsset = null;
    },
    onUpdateAsset: (state, { payload }) => {
      state.assets = state.assets.map((asset) => {
        if (asset.aid === payload.aid) return payload;
        return asset;
      });
    },
    onDeleteAsset: (state) => {
      if (state.activeAsset) {
        state.assets = state.assets.filter(
          (asset) => asset.id !== state.activeAsset.id
        );
        state.activeAsset = null;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onAddNewAsset,
  onDeleteAsset,
  onLoadAssets,
  onSetActiveAsset,
  onUpdateAsset,
} = assetsSlice.actions;
