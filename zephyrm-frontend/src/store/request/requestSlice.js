/**
 * Requests slice
 *
 * This slice contains the state and reducers for the requests module.
 *
 * @module store/request/requestSlice
 */

import { createSlice } from "@reduxjs/toolkit";

export const requestSlice = createSlice({
  name: "request",
  initialState: {
    isLoadingRequests: true,
    requests: [],
  },
  reducers: {
    /**
     * Loads all requests from the server.
     *
     * This reducer is used when all requests are loaded from the server.
     * It receives the list of requests as a payload and sets the state
     * with that list. It also sets isLoadingRequests to false to
     * indicate that the requests have been loaded. The requests are
     * added to the state in the order they were received, but are
     * sorted by creation date in descending order.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the list of requests.
     */
    onLoadRequests: (state, { payload = [] }) => {
      state.isLoadingRequests = false;
      payload.forEach((request) => {
        const exists = state.requests.some(
          (dbRequest) => dbRequest.rid === request.rid
        );
        if (!exists) {
          state.requests.push(request);
        }
      });
      state.requests.sort(
        (a, b) => new Date(b.creationDate) - new Date(a.creationDate)
      );
    },
    /**
     * Adds a new request to the list of requests.
     *
     * This reducer is used when a new request is created. It receives the new
     * request object as a payload and adds it to the list of requests in the state.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the new request object.
     */
    onCreateRequest: (state, { payload }) => {
      state.requests.push(payload);
    },
    /**
     * Deletes a request from the list of requests.
     *
     * This reducer is used when a request is deleted. It receives the ID of
     * the request to delete as a payload and deletes the request from the
     * list of requests in the state.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the ID of the request to delete.
     */
    onDeleteRequest: (state, { payload }) => {
      if (payload) {
        state.requests = state.requests.filter(
          (request) => request.rid !== payload
        );
      }
    },
    /**
     * Updates the status of a request.
     *
     * This reducer is used when the status of a request is updated. It receives
     * the request ID and the new status as a payload and updates the status of
     * the request in the state.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the request ID and the new status.
     */
    onMarkRequestStatus: (state, { payload }) => {
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
     * @param {Object} state The current state of the reducer.
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
  onDeleteRequest,
  onLoadRequests,
  onLogoutRequests,
  onMarkRequestStatus,
} = requestSlice.actions;
