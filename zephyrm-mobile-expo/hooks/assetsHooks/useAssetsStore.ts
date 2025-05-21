import { Alert } from "react-native";
import { useSelector } from "react-redux";

import { zephyrmApi } from "../../apis";
import { Asset } from "../../interfaces";
import {
  onLoadAssets,
  onSetActiveAsset,
  onUpdateAsset,
} from "../../store/assetsModule/assetsSlice";
import { useAppDispatch } from "../../store/store";

export const useAssetsStore = () => {
  const dispatch = useAppDispatch();
  const { assets, activeAsset } = useSelector((state: any) => state.assets);

  const startLoadingAssets = async () => {
    try {
      const { data } = await zephyrmApi.get("assets");
      dispatch(onLoadAssets(data.assets));
    } catch (error: any) {
      Alert.alert("Error loading assets", error.response.data.msg);
    }
  };

  const setActiveAsset = (asset: Asset) => {
    dispatch(onSetActiveAsset(asset));
  };

  const startSavingAsset = async (asset: Asset) => {
    if (!asset) return;
    try {
      if (asset.aid) {
        await zephyrmApi.put(`assets/${asset.aid}`, asset);
        dispatch(onUpdateAsset(asset));
        startLoadingAssets();
        return;
      }
    } catch (error: any) {
      Alert.alert("Error updating", error.response.data.msg);
    }
  };

  return {
    // Properties
    assets,
    activeAsset,

    // Methods
    setActiveAsset,
    startLoadingAssets,
    startSavingAsset,
  };
};
