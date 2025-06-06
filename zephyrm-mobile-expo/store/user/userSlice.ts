/**
 * User slice
 *
 * @module store/user/userSlice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../interfaces/login/userInterface";

interface UserState {
  isLoadingUsers: boolean;
  users: User[];
  activeUser: User | null;
}

const initialState: UserState = {
  isLoadingUsers: true,
  users: [],
  activeUser: null,
};

/**
 * This slice contains the state and reducers for the user module.
 */
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /**
     * Sets the specified user as the active user in the state.
     *
     * This reducer is used to designate a user as currently active. It receives
     * a user object as a payload and updates the state to reflect this user as
     * the active user.
     *
     * @param {Object} state - The current state of the user slice.
     * @param {PayloadAction<User>} payload - The payload containing the user object to set as active.
     */
    onSetActiveUser: (state, { payload }: PayloadAction<User>) => {
      state.activeUser = payload;
    },

    /**
     * Adds a new user to the list of users and sets the active user to null.
     *
     * This reducer is used when a new user is created. It receives the new
     * user object as a payload and adds it to the list of users in the state.
     * It also sets the active user to null.
     *
     * @param {Object} state - The current state of the user slice.
     * @param {PayloadAction<User>} payload - The payload containing the new user object.
     */
    onAddNewUser: (state, { payload }: PayloadAction<User>) => {
      state.users.push(payload);
      state.activeUser = null;
    },

    /**
     * Updates an existing user in the list of users.
     *
     * This reducer is used when a user is modified. It receives the updated
     * user object as a payload, finds the user with the matching uid in the
     * state, and replaces it with the updated user. If no matching uid is found,
     * the user remains unchanged.
     *
     * @param {Object} state - The current state of the user slice.
     * @param {PayloadAction<User>} payload - The payload with the updated user object.
     */
    onUpdateUser: (state, { payload }: PayloadAction<User>) => {
      state.users = state.users.map((user) => {
        if (user.uid === payload.uid) return payload;
        return user;
      });
    },

    /**
     * Deletes the active user from the list of users and sets the active user to null.
     *
     * This reducer is used when the user is deleted. It filters the active user from
     * the list of users in the state and sets the active user to null.
     *
     * @param {Object} state - The current state of the user slice.
     */
    onDeleteUser: (state) => {
      if (state.activeUser) {
        state.users = state.users.filter(
          (user) => user.uid !== state.activeUser?.uid
        );
        state.activeUser = null;
      }
    },

    /**
     * Loads the list of users from the server and adds them to the state.
     *
     * This reducer is used when the list of users is loaded from the server.
     * It receives the list of users as a payload, sets isLoadingUsers to false,
     * and replaces the state's list of users with the loaded users.
     *
     * @param {UserState} state - The current state of the user slice.
     * @param {PayloadAction<User[]>} payload - The payload with the list of users.
     */
    onLoadUsers: (state, { payload }: PayloadAction<User[]>) => {
      state.isLoadingUsers = false;
      state.users = payload;
    },

    /**
     * Resets the user state when the user logs out.
     *
     * This reducer is used when the user logs out. It sets isLoadingUsers to false,
     * clears the list of users, and sets the active user to null.
     *
     * @param {UserState} state - The current state of the user slice.
     */
    onLogoutUsers: (state) => {
      state.isLoadingUsers = false;
      state.users = [];
      state.activeUser = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onSetActiveUser,
  onAddNewUser,
  onUpdateUser,
  onDeleteUser,
  onLoadUsers,
  onLogoutUsers,
} = userSlice.actions;
