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

export const useAssetsStore = () => {
  const dispatch = useDispatch();
  const { assets, activeAsset } = useSelector((state) => state.assets);

  const startLoadingAssets = async () => {
    try {
      const { data } = await zephyrmApi.get("assets");
      dispatch(onLoadAssets(data.assets));
    } catch (error) {
      Swal.fire("Error loading assets", error.response.data.msg, "error");
    }
  };

  const setActiveAsset = (asset) => {
    dispatch(onSetActiveAsset(asset));
  };

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

  const startSavingAsset = (asset) => {
    if (!asset) return;
    try {
      if (asset.aid) {
        // Update
        zephyrmApi.put(`assets/${asset.aid}`, asset);
        dispatch(onUpdateAsset(asset));
        Swal.fire("Updated successfully", "", "success");
        startLoadingAssets();
        return;
      }

      // Create
      zephyrmApi.post("assets/new", asset);
      dispatch(onAddNewAsset(asset));
      Swal.fire("Created successfully", "", "success");
      startLoadingAssets();
    } catch (error) {
      Swal.fire("Error updating", error.response.data.msg, "error");
    }
  };

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
  };
};
