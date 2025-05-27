/**
 * Assets store hook
 *
 * Custom hook for managing assets within the application
 *
 * @module modules/assetsModule/hooks/useAssetsStore
 */

import { useDispatch, useSelector } from "react-redux";
import zephyrmApi from "../../../apis/zephyrMAPI";
import Swal from "sweetalert2";
import {
  onAddNewAsset,
  onDeleteAsset,
  onLoadAssets,
  onSetActiveAsset,
  onUpdateAsset,
} from "../../../store/assetsModule/assetsSlice";

/**
 * This hook provides functions to create, delete, and update assets
 * for various events and user actions. It interacts with the server to
 * update asset data and dispatches Redux actions to update the
 * application's state.
 *
 * Methods:
 * - `startLoadingAssets()`: Loads all assets from the server.
 * - `setActiveAsset(asset)`: Sets a single asset as active.
 * - `startDeletingAsset(aid)`: Deletes an asset by its ID.
 * - `startSavingAsset(asset)`: Creates a new asset or updates an existing one.
 * - `startAssigningUserToAsset(uid)`: Assigns a user to an asset.
 * - `startDownloadingAssetsFile()`: Downloads all assets as an Excel file.
 *
 * These methods handle server communication and manage the application's
 * asset state via Redux.
 *
 * @returns {object} An object containing the followin properties and methods:
 * - `assets`: The list of all available assets.
 * - `activeAsset`: The currently active asset.
 * - `setActiveAsset(asset)`: Sets a single asset as active.
 * - `startDeletingAsset(aid)`: Deletes an asset by its ID.
 * - `startSavingAsset(asset)`: Creates a new asset or updates an existing one.
 * - `startAssigningUserToAsset(uid)`: Assigns a user to an asset.
 * - `startDownloadingAssetsFile()`: Downloads all assets as an Excel file.
 */
export const useAssetsStore = () => {
  const dispatch = useDispatch();
  const { assets, activeAsset } = useSelector((state) => state.assets);

  /**
   * Loads all assets from the server.
   *
   * It makes a GET request to the server to fetch all available
   * assets. If the request is successful, it dispatches the
   * onLoadAssets action with the received assets to update the
   * application's state. If an error occurs during the request,
   * it displays an error message using Swal.fire.
   */
  const startLoadingAssets = async () => {
    try {
      const { data } = await zephyrmApi.get("assets");
      dispatch(onLoadAssets(data.assets));
    } catch (error) {
      Swal.fire("Error loading assets", error.response.data.msg, "error");
    }
  };

  /**
   * Sets a single asset as active.
   *
   * It dispatches the onSetActiveAsset action with the provided
   * asset to update the application's state.
   * @param {Object} asset The asset to be set as active.
   */
  const setActiveAsset = (asset) => {
    dispatch(onSetActiveAsset(asset));
  };

  /**
   * Deletes an asset by its ID.
   *
   * This function makes a DELETE request to the server to remove
   * the asset with the specified ID. Upon successful delete,
   * it dispatches the onDeleteAsset action to update the state
   * and shows a success message. If an error occurs, it displays
   * an error message.
   *
   * @param {string} aid - The ID of the asset to delete.
   */
  const startDeletingAsset = async (aid) => {
    if (!aid) return;

    try {
      await zephyrmApi.delete(`assets/${aid}`);
      dispatch(onDeleteAsset());
      Swal.fire("Deleted successfully", "", "success");
      startLoadingAssets();
    } catch (error) {
      Swal.fire("Error deleting", error.response.data.msg, "error");
    }
  };

  /**
   * Creates a new asset or updates an existing one.
   *
   * Makes a POST or PUT request to the server to create a new asset
   * or update an existing one. If the request is successful, it dispatches
   * either the onAddNewAsset or onUpdateAsset action to update the
   * application's state. It also shows a success message. If an error
   * occurs, it displays an error message.
   *
   * @param {Object} asset The asset to be created or updated.
   */
  const startSavingAsset = async (asset) => {
    if (!asset) return;
    try {
      if (asset.aid) {
        // Update
        await zephyrmApi.put(`assets/${asset.aid}`, asset);
        dispatch(onUpdateAsset(asset));
        Swal.fire("Updated successfully", "", "success");
        startLoadingAssets();
        return;
      }

      // Create
      await zephyrmApi.post("assets/new", asset);
      dispatch(onAddNewAsset(asset));
      Swal.fire("Created successfully", "", "success");
      startLoadingAssets();
    } catch (error) {
      Swal.fire("Error updating", error.response.data.msg, "error");
    }
  };

  /**
   * Assigns a user to an asset or clears the assigned user.
   *
   * Makes a PUT request to the server to assign a user to an asset
   * or to clear the user assigned to an asset. If the request is
   * successful, it dispatches the onUpdateAsset action to update
   * the state and shows a success message. If an error occurs, it
   * displays an error message.
   *
   * @param {string|null} uid The ID of the user to assign, or null
   * to clear the assigned user.
   */
  const startAssigningUserToAsset = async (uid) => {
    if (!activeAsset) return;

    try {
      const { data } = await zephyrmApi.put(
        `assets/assign/${activeAsset.aid}`,
        { uid }
      );

      dispatch(onUpdateAsset(data.updatedAsset));
      if (uid === null) {
        Swal.fire("Cleared successfully", "", "success");
      } else {
        Swal.fire("Assigned successfully", "", "success");
      }
      startLoadingAssets();
    } catch (error) {
      console.log(error);
      Swal.fire("Error assigning", error.response.data.msg, "error");
    }
  };

  /**
   * Downloads all assets as an Excel file.
   *
   * It makes a GET request to the server to fetch the Excel file
   * with all available assets. If the request is successful, it
   * creates a blob from the response data, creates a link to
   * download the blob as an Excel file, and then clicks the link
   * to start the download. If an error occurs during the request,
   * it displays an error message using Swal.fire.
   */
  const startDownloadingAssetsFile = async () => {
    try {
      const response = await zephyrmApi.get("assets/xlsx", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/xlsx" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "assets_report.xlsx";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
      Swal.fire("Error downloading", error.response.data.msg, "error");
    }
  };

  return {
    // Properties
    assets,
    activeAsset,

    // Methods
    setActiveAsset,
    startAssigningUserToAsset,
    startDeletingAsset,
    startLoadingAssets,
    startSavingAsset,
    startDownloadingAssetsFile,
  };
};
