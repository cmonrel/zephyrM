/**
 * Assets store hook
 *
 * @module hooks/assetsHooks/useAssetsStore
 */

import { Alert } from "react-native";
import { useSelector } from "react-redux";

import { zephyrmApi } from "../../apis";
import { Asset } from "../../interfaces";
import {
  onAddNewAsset,
  onDeleteAsset,
  onLoadAssets,
  onSetActiveAsset,
  onUpdateAsset,
} from "../../store/assetsModule/assetsSlice";
import { useAppDispatch } from "../../store/store";

/**
 * Custom hook for managing assets within the application
 *
 * @returns An object with the following properties:
 *
 * - `assets`: An array of all assets in the application.
 * - `activeAsset`: The currently active asset.
 *
 * And the following methods:
 *
 * - `setActiveAsset(asset: Asset | null)`: Sets the currently active asset.
 * - `startDeletingAsset(aid: string)`: Deletes the asset with the given ID.
 * - `startLoadingAssets()`: Loads all assets from the API.
 * - `startSavingAsset(asset: Asset)`: Saves or updates the given asset.
 */
export const useAssetsStore = () => {
  const dispatch = useAppDispatch();
  const { assets, activeAsset } = useSelector((state: any) => state.assets);

  /**
   * Loads all assets from the API.
   *
   * Makes a GET request to the API to fetch all available assets.
   * If the request is successful, it dispatches the onLoadAssets action
   * with the received assets to update the application's state. If an error
   * occurs during the request, it displays an error message using Alert.alert.
   */
  const startLoadingAssets = async () => {
    try {
      const { data } = await zephyrmApi.get("assets");
      dispatch(onLoadAssets(data.assets));
    } catch (error: any) {
      Alert.alert("Error loading assets", error.response.data.msg);
    }
  };

  /**
   * Sets the currently active asset.
   *
   * Dispatches the onSetActiveAsset action with the given asset to update
   * the application's state.
   *
   * @param {Asset | null} asset - The asset to set as active, or null to clear the active asset.
   */
  const setActiveAsset = (asset: Asset | null) => {
    dispatch(onSetActiveAsset(asset));
  };

  /**
   * Saves or updates the given asset.
   *
   * Makes a POST or PUT request to the API to create or update the asset.
   * If the request is successful, it dispatches the onAddNewAsset or onUpdateAsset action
   * depending on whether the asset is being created or updated, and reloads all assets
   * from the API. If an error occurs during the request, it displays an error message
   * using Alert.alert.
   *
   * @param {Asset} asset - The asset to save or update.
   */
  const startSavingAsset = async (asset: Asset) => {
    if (!asset) return;
    try {
      if (asset.aid) {
        // Update
        await zephyrmApi.put(`assets/${asset.aid}`, asset);
        dispatch(onUpdateAsset(asset));
        startLoadingAssets();
        return;
      }
      // Create
      await zephyrmApi.post("assets/new", asset);
      dispatch(onAddNewAsset(asset));
      startLoadingAssets();
      Alert.alert("Created successfully");
    } catch (error: any) {
      Alert.alert("Error updating or creating", error.response.data.msg);
    }
  };

  /**
   * Deletes the asset with the given ID.
   *
   * Makes a DELETE request to the API to delete the asset with the given ID.
   * If the request is successful, it dispatches the onDeleteAsset action to update
   * the application's state, shows a success message, and reloads all assets from the API.
   * If an error occurs during the request, it displays an error message using Alert.alert.
   *
   * @param {string} aid - The ID of the asset to delete.
   */
  const startDeletingAsset = async (aid: string) => {
    if (!aid) return;

    try {
      await zephyrmApi.delete(`assets/${aid}`);
      dispatch(onDeleteAsset());
      Alert.alert("Deleted successfully");
      startLoadingAssets();
    } catch (error: any) {
      Alert.alert("Error deleting", error.response.data.msg);
    }
  };

  return {
    // Properties
    assets,
    activeAsset,

    // Methods
    setActiveAsset,
    startDeletingAsset,
    startLoadingAssets,
    startSavingAsset,
  };
};
