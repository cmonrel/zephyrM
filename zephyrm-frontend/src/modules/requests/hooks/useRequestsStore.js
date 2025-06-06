/**
 * Requests store hook
 *
 * Custom hook for managing requests within the application
 *
 * @module modules/requests/hooks/useRequestsStore
 */

import { useDispatch, useSelector } from "react-redux";

import { useAssetsStore } from "../../assetsModule/hooks/useAssetsStore";
import zephyrmApi from "../../../apis/zephyrMAPI";
import {
  onCreateRequest,
  onDeleteRequest,
  onLoadRequests,
  onMarkRequestStatus,
} from "../../../store/request/requestSlice";
import Swal from "sweetalert2";

/**
 * This custom hook provides functions to manage requests within the application,
 * including loading, creating, deleting, and updating request statuses. The hook
 * interacts with the server to update request data and dispatches Redux actions
 * to maintain the application's state.
 *
 * Methods:
 * - `startLoadingRequests()`: Loads all requests from the server.
 * - `startDeletingRequest(rid)`: Deletes a request by its ID.
 * - `startMarkStatusRequest(rid, status, aid, uid)`: Updates the status of a request.
 * - `startSavingRequest(request)`: Creates a new request.
 *
 * @returns {object} An object containing the following properties and methods:
 * - `isLoadingRequests`: A flag indicating if requests are currently being loaded.
 * - `requests`: The list of all available requests.
 * - `startLoadingRequests()`: Loads all requests from the server.
 * - `startDeletingRequest(rid)`: Deletes a request by its ID.
 * - `startMarkStatusRequest(rid, status, aid, uid)`: Updates the status of a request.
 * - `startSavingRequest(request)`: Creates a new request.
 */
export const useRequestsStore = () => {
  const dispatch = useDispatch();
  const { requests, isLoadingRequests } = useSelector((state) => state.request);
  const { assets, startSavingAsset } = useAssetsStore();

  /**
   * Loads all requests from the server.
   *
   * Makes a GET request to the server to fetch all available requests.
   * If the request is successful, it dispatches the onLoadRequests action
   * to update the application's state. If an error occurs, it displays an
   * error message and throws an error.
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
   * Deletes a request by its ID.
   *
   * Makes a DELETE request to the server to delete a request with the
   * specified ID. If the request is successful, it dispatches the
   * onDeleteRequest action to update the application's state and starts
   * loading requests again. If an error occurs, it displays an error
   * message.
   *
   * @param {string} rid - The ID of the request to delete.
   */
  const startDeletingRequest = async (rid) => {
    try {
      await zephyrmApi.delete(`requests/${rid}`);
      dispatch(onDeleteRequest(rid));
      startLoadingRequests();
    } catch (error) {
      Swal.fire("Error deleting request", error.response.data.msg, "error");
    }
  };

  /**
   * Updates the status of a request.
   *
   * Makes a PUT request to the server to update a request with the
   * specified ID. If the request is successful, it dispatches the
   * onMarkRequestStatus action to update the application's state and
   * starts loading requests again. If an error occurs, it displays an
   * error message.
   *
   * If the status is set to "Approved", it also updates the asset with
   * the given ID and sets its state to "On loan" and the user to the
   * given user ID.
   *
   * @param {string} rid - The ID of the request to update.
   * @param {string} status - The new status of the request.
   * @param {string} aid - The ID of the asset to update, if the status is "Approved".
   * @param {string} uid - The ID of the user to assign the asset to, if the status is "Approved".
   * @param {string} denialMotive - The motive for denying the request, if the status is "Denied".
   */
  const startMarkStatusRequest = async (
    rid,
    status,
    aid,
    uid,
    denialMotive
  ) => {
    if (status === "Pending") return;
    try {
      if (status === "Approved") {
        const asset = assets.find((asset) => asset.aid === aid);

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
    } catch (error) {
      Swal.fire("Error updating request", error.response.data.msg, "error");
    }
  };

  /**
   * Saves a new request to the server.
   *
   * Makes a POST request to the server to create a new request.
   * If the request is successful, it dispatches the onCreateRequest
   * action to update the application's state and starts loading
   * requests again. If an error occurs, it displays an error message.
   *
   * @param {Object} request - The request object to be saved.
   */
  const startSavingRequest = async (request) => {
    if (!request) return;
    try {
      const { data } = await zephyrmApi.post("requests/new", request);
      const { savedRequest } = data;

      dispatch(onCreateRequest(savedRequest));
      startLoadingRequests();
    } catch (error) {
      Swal.fire("Error creating request", error.response.data.msg, "error");
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
