/**
 * Authentication slice
 *
 * This slice contains the state and reducers for the authentication module.
 *
 * @module store/auth/authSlice
 */

import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "checking", // 'checking', 'not-authenticated', 'authenticated'
    user: {},
    errorMessage: undefined,
  },
  reducers: {
    /**
     * Sets the authentication status to "checking", resets the user and
     * errorMessage.
     *
     * @param state The current state of the reducer.
     */
    onChecking: (state) => {
      state.status = "checking";
      state.user = {};
      state.errorMessage = undefined;
    },

    /**
     * Sets the authentication status to "authenticated" and updates the user state.
     *
     * This reducer is used when a user successfully logs in. It receives the user
     * information as a payload and updates the authentication state accordingly.
     * The errorMessage state is cleared as the login was successful.
     *
     * @param {Object} state - The current state of the reducer.
     * @param {Object} payload - The payload containing user information.
     */
    onLogin: (state, { payload }) => {
      state.status = "authenticated";
      state.user = payload;
      state.errorMessage = undefined;
    },
    /**
     * Sets the authentication status to "not-authenticated", resets the user and
     * updates the errorMessage.
     *
     * This reducer is used when a user logs out. It receives an optional error
     * message as a payload and updates the authentication state accordingly.
     *
     * @param {Object} state - The current state of the reducer.
     * @param {Object} payload - The payload containing an optional error message.
     */
    onLogout: (state, { payload }) => {
      state.status = "not-authenticated";
      state.user = {};
      state.errorMessage = payload;
    },
    /**
     * Clears the errorMessage state.
     *
     * This reducer is used to clear any error messages that may have been set.
     *
     * @param {Object} state - The current state of the reducer.
     */
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { clearErrorMessage, onChecking, onLogin, onLogout } =
  authSlice.actions;
