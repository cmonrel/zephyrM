import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { zephyrmApi } from "../../apis";
import { Asset } from "../../interfaces";
import {
  RequestInter,
  status,
} from "../../interfaces/request/requestInterface";
import {
  onCreateRequest,
  onDeleteRequest,
  onLoadRequests,
  onMarkRequestStatus,
} from "../../store/requests/requestSlice";
import { useAppDispatch } from "../../store/store";
import { useAssetsStore } from "../assetsHooks/useAssetsStore";

export const useRequestsStore = () => {
  const dispatch = useAppDispatch();
  const { requests, isLoadingRequests } = useSelector(
    (state: any) => state.requests
  );
  const { assets, startSavingAsset } = useAssetsStore();

  const startLoadingRequests = async () => {
    try {
      const { data } = await zephyrmApi("requests");

      dispatch(onLoadRequests(data.requests));
    } catch (error) {
      console.log(error);
      throw new Error("Error loading requests");
    }
  };

  const startDeletingRequest = async (rid: string) => {
    try {
      await zephyrmApi.delete(`requests/${rid}`);
      dispatch(onDeleteRequest(rid));
      startLoadingRequests();
    } catch (error: any) {
      Alert.alert("Error deleting request", error.response.data.msg);
    }
  };

  const startMarkStatusRequest = async (
    rid: string,
    status: status,
    aid: string,
    uid?: string
  ) => {
    if (status === "Pending") return;
    try {
      if (status === "Approved") {
        const asset = assets.find((asset: Asset) => asset.aid === aid);
        const updateAsset = {
          ...asset,
          state: "On loan",
          user: uid,
        };
        if (updateAsset) startSavingAsset(updateAsset);
      }
      await zephyrmApi.put(`requests/${rid}`, { status });
      dispatch(onMarkRequestStatus({ rid, status }));
      startLoadingRequests();
    } catch (error: any) {
      Alert.alert("Error updating request", error.response.data.msg);
    }
  };

  const startSavingRequest = async (request: RequestInter) => {
    if (!request) return;
    try {
      const { data } = await zephyrmApi.post("requests/new", request);
      const { savedRequest } = data;

      dispatch(onCreateRequest(savedRequest));
      startLoadingRequests();
    } catch (error: any) {
      Alert.alert("Error creating request", error.response.data.msg);
    }
  };

  return {
    // Properties
    isLoadingRequests,
    requests,

    // Methods
    startDeletingRequest,
    startLoadingRequests,
    startMarkStatusRequest,
    startSavingRequest,
  };
};
