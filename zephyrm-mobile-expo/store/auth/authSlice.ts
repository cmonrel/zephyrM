/**
 * Auth slice
 *
 * @module store/auth/authSlice
 */

import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { AuthUser } from "../../interfaces/login/userInterface";

type AuthStatus = "checking" | "authenticated" | "not-authenticated";

interface AuthState {
  status: AuthStatus;
  user: AuthUser;
  errorMessage: string | undefined;
}

const initialState: AuthState = {
  status: "checking",
  user: { uid: "", name: "", counter: 0, role: "" },
  errorMessage: undefined,
};

/**
 * This slice contains the state and reducers for the auth module.
 */
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Resets the authentication state to checking.
     *
     * This reducer sets the status to checking, resets the user to the initial
     * state, and clears the error message. It is used when the user
     * initially logs in or when the user's authentication token is
     * being checked.
     */
    onChecking: (state) => {
      state.status = "checking";
      state.user = initialState.user;
      state.errorMessage = undefined;
    },

    /**
     * Sets the authentication status to authenticated and updates the user information.
     *
     * This reducer is used when a user successfully logs in or when the authentication
     * token is verified. It sets the authentication status to "authenticated",
     * updates the user information in the state with the provided payload, and
     * clears any existing error message.
     *
     * @param {Object} state - The current state of the reducer.
     * @param {PayloadAction<AuthUser>} { payload } - The payload containing the
     * updated user information.
     */
    onLogin: (state, { payload }: PayloadAction<AuthUser>) => {
      state.status = "authenticated";
      state.user = payload;
      state.errorMessage = undefined;
    },

    /**
     * Sets the authentication status to not-authenticated and resets the user information.
     *
     * This reducer is used when the user logs out or when the authentication token is
     * invalid. It sets the authentication status to "not-authenticated",
     * resets the user information in the state to the initial state, and
     * sets the error message to the provided payload.
     *
     * @param {Object} state - The current state of the reducer.
     * @param {PayloadAction<string>} { payload } - The payload containing the
     * error message or an empty string if there is no error message.
     */
    onLogout: (state, { payload }: PayloadAction<string>) => {
      state.status = "not-authenticated";
      state.user = initialState.user;
      state.errorMessage = payload;
    },

    /**
     * Clears the current error message.
     *
     * This reducer is used to reset the error message in the state to undefined.
     * It can be dispatched after an error has been handled or displayed
     * to ensure that the state reflects no current errors.
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
