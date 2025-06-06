/**
 * Requests store hook
 *
 * @module hooks/requests/useRequestsStore
 */

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

/**
 * Custom hook for managing requests within the application
 *
 * @function useRequestsStore
 * @returns {Object} An object containing the following properties:
 *  - isLoadingRequests: A boolean indicating whether the requests are being loaded.
 *  - requests: An array of Request objects.
 *  - startLoadingRequests: A function to load the requests from the API.
 *  - startDeletingRequest: A function to delete a request by id.
 *  - startMarkStatusRequest: A function to mark a request as approved or denied.
 *  - startSavingRequest: A function to save a new request.
 */
export const useRequestsStore = () => {
  const dispatch = useAppDispatch();
  const { requests, isLoadingRequests } = useSelector(
    (state: any) => state.requests
  );
  const { assets, startSavingAsset } = useAssetsStore();

  /**
   * Loads all requests from the API.
   *
   * Makes a GET request to the API to fetch all available requests.
   * If the request is successful, it dispatches the onLoadRequests action
   * with the received requests to update the application's state. If an error
   * occurs during the request, it logs an error message to the console.
   */
  const startLoadingRequests = async () => {
    try {
      const { data } = await zephyrmApi("requests");

      dispatch(onLoadRequests(data.requests));
    } catch (error) {
      console.log(error);
      throw new Error("Error loading requests");
    }
  };

  /**
   * Deletes a request by its id and reloads the requests list.
   *
   * Makes a DELETE request to the server to delete a request with the
   * specified id. If the request is successful, it dispatches the
   * onDeleteRequest action with the id of the deleted request. If an error
   * occurs, it displays an error alert.
   *
   * @param {string} rid - The id of the request to be deleted.
   */
  const startDeletingRequest = async (rid: string) => {
    try {
      await zephyrmApi.delete(`requests/${rid}`);
      dispatch(onDeleteRequest(rid));
      startLoadingRequests();
    } catch (error: any) {
      Alert.alert("Error deleting request", error.response.data.msg);
    }
  };

  /**
   * Updates a request by its id with the given status and denial motive. If the status is "Approved"
   * and the asset is already "On loan", it denies the request. If the status is "Approved" and the asset
   *  is not "On loan", it updates the asset to be "On loan" and assigns the user to the asset.
   *
   * Makes a PUT request to the server to update a request with the
   * specified id. If the request is successful, it dispatches the
   * onMarkRequestStatus action with the id of the updated request and
   * the new status. If an error occurs, it displays an error alert.
   *
   * @param {string} rid - The id of the request to be updated.
   * @param {status} status - The new status of the request.
   * @param {string} aid - The id of the asset of the request.
   * @param {string} denialMotive - The motive of the denial, if the status is "Denied".
   * @param {string} uid - The id of the user to assign the asset to, if the status is "Approved" and the asset is not "On loan".
   */
  const startMarkStatusRequest = async (
    rid: string,
    status: status,
    aid: string,
    denialMotive: string,
    uid?: string
  ) => {
    if (status === "Pending") return;
    try {
      if (status === "Approved") {
        const asset = assets.find((asset: Asset) => asset.aid === aid);

        if (asset.state === "On loan") {
          const deny = "Asset is already being used";
          const state = "Denied";

          await zephyrmApi.put(`requests/${rid}`, {
            status: state,
            denialMotive: deny,
          });
          dispatch(onMarkRequestStatus({ rid, status }));
          startLoadingRequests();
          return;
        }

        const updateAsset = {
          ...asset,
          state: "On loan",
          user: uid,
        };
        if (updateAsset) startSavingAsset(updateAsset);
      }
      await zephyrmApi.put(`requests/${rid}`, { status, denialMotive });
      dispatch(onMarkRequestStatus({ rid, status }));
      startLoadingRequests();
    } catch (error: any) {
      Alert.alert("Error updating request", error.response.data.msg);
    }
  };

  /**
   * Saves a new request to the server.
   *
   * Makes a POST request to the server to create a new request with the
   * specified details. If the request is successful, it dispatches the
   * onCreateRequest action with the newly created request and reloads the
   * list of requests. If an error occurs, it displays an error message
   * using Alert.alert.
   *
   * @param {RequestInter} request - The request to be saved.
   */
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
