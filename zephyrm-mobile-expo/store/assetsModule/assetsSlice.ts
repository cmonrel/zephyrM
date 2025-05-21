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

export const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    onLoadAssets: (state, { payload = [] }: PayloadAction<Asset[]>) => {
      state.isLoadingAssets = false;
      state.assets = payload;
    },
    onSetActiveAsset: (state, { payload }: PayloadAction<Asset>) => {
      state.activeAsset = payload;
    },
    onAddNewAsset: (state, { payload }: PayloadAction<Asset>) => {
      state.assets.push(payload);
      state.activeAsset = null;
    },
    onUpdateAsset: (state, { payload }: PayloadAction<Asset>) => {
      state.assets = state.assets.map((asset) => {
        if (asset.aid === payload.aid) return payload;
        return asset;
      });
    },
    onDeleteAsset: (state) => {
      if (state.activeAsset) {
        state.assets = state.assets.filter(
          (asset) => asset.aid !== state.activeAsset.aid
        );
        state.activeAsset = null;
      }
    },
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
