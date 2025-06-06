/**
 * Request slice
 *
 * @module store/requests/requestSlice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  RequestInter,
  status,
} from "../../interfaces/request/requestInterface";

interface RequestState {
  isLoadingRequests: boolean;
  requests: RequestInter[];
}

const initialState: RequestState = {
  isLoadingRequests: true,
  requests: [],
};

/**
 * This slice contains the state and reducers for the requests module.
 */
export const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {
    /**
     * Reducer to load all the requests from the API.
     *
     * Receives an array of RequestInter objects as payload and adds them to the state.
     * If a request already exists in the state, it is not added.
     *
     * @param {RequestInter[]} [payload=[]] The requests to be loaded.
     */
    onLoadRequests: (
      state,
      { payload = [] }: PayloadAction<RequestInter[]>
    ) => {
      state.isLoadingRequests = false;
      payload.forEach((request) => {
        const exists = state.requests.some(
          (dbRequest) => dbRequest.rid === request.rid
        );
        if (!exists) {
          state.requests.push(request);
        }
      });
    },

    /**
     * Adds a new request to the state.
     *
     * This reducer is used when a new request is created. It receives the new
     * request object as a payload and adds it to the list of requests in the
     * state.
     *
     * @param {RequestState} state - The current state of the requests slice.
     * @param {PayloadAction<RequestInter>} payload - The payload with the new request object.
     */
    onCreateRequest: (state, { payload }: PayloadAction<RequestInter>) => {
      state.requests.push(payload);
    },

    /**
     * Deletes a request from the state.
     *
     * This reducer is used when a request is deleted. It receives the ID of the
     * request to be deleted as a payload and filters the requests array to exclude
     * the request with the matching ID.
     *
     * @param {RequestState} state - The current state of the requests slice.
     * @param {PayloadAction<string>} payload - The ID of the request to be deleted.
     */
    onDeleteRequest: (state, { payload }: PayloadAction<string>) => {
      if (payload) {
        state.requests = state.requests.filter(
          (request) => request.rid !== payload
        );
      }
    },

    /**
     * Updates the status of a specified request in the state.
     *
     * This reducer is used to change the status of an existing request in the state.
     * It receives a payload containing the request ID and the new status. The reducer
     * iterates over the requests array, finds the request with the matching ID, and
     * updates its status with the new value provided in the payload.
     *
     * @param {RequestState} state - The current state of the requests slice.
     * @param {PayloadAction<{ rid: string; status: status }>} payload - An object containing the ID of the request to be updated and the new status value.
     */

    onMarkRequestStatus: (
      state,
      { payload }: PayloadAction<{ rid: string; status: status }>
    ) => {
      if (payload) {
        state.requests = state.requests.map((request) => {
          if (request.rid === payload.rid) {
            request.status = payload.status;
          }
          return request;
        });
      }
    },

    /**
     * Resets the requests state when the user logs out.
     *
     * This reducer is used when the user logs out. It resets the state
     * of the requests module to its initial value, setting isLoadingRequests
     * to true and clearing the list of requests.
     *
     * @param {RequestState} state - The current state of the requests slice.
     */
    onLogoutRequests: (state) => {
      state.isLoadingRequests = true;
      state.requests = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onCreateRequest,
  onLoadRequests,
  onDeleteRequest,
  onMarkRequestStatus,
  onLogoutRequests,
} = requestSlice.actions;
