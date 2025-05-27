/**
 * User slice
 *
 * This slice contains the state and reducers for the user module.
 *
 * @module store/user/userSlice
 */

import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoadingUsers: true,
    users: [],
    activeUser: null,
  },
  reducers: {
    /**
     * Sets the active user to the given user.
     *
     * This reducer is used when a user is selected in the list.
     * It receives the user object as a payload and sets the state
     * with that user.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the user object.
     */
    onSetActiveUser: (state, { payload }) => {
      state.activeUser = payload;
    },
    /**
     * Adds a new user to the list of users and sets the active user to null.
     *
     * This reducer is used when a new user is created. It receives the new
     * user object as a payload and adds it to the list of users in the state.
     * It also sets the active user to null.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the new user object.
     */
    onAddNewUser: (state, { payload }) => {
      state.users.push(payload);
      state.activeUser = null;
    },
    /**
     * Updates an existing user in the list of users.
     *
     * This reducer is used when a user is updated. It receives the updated
     * user object as a payload and updates the list of users in the state
     * with the new user.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the updated user object.
     */
    onUpdateUser: (state, { payload }) => {
      state.users = state.users.map((user) => {
        if (user.uid === payload.uid) return payload;
        return user;
      });
    },
    /**
     * Deletes a user from the list of users and sets the active user to null.
     *
     * This reducer is used when a user is deleted. It receives no payload and
     * deletes the active user from the list of users in the state and sets
     * the active user to null.
     *
     * @param {Object} state The current state of the reducer.
     */
    onDeleteUser: (state) => {
      if (state.activeUser) {
        state.users = state.users.filter(
          (user) => user.id !== state.activeUser.id
        );
      }
      state.activeUser = null;
    },
    /**
     * Loads all users from the server.
     *
     * This reducer is used when all users are loaded from the server.
     * It receives the list of users as a payload and sets the state
     * with that list. It also sets isLoadingUsers to false to
     * indicate that the users have been loaded.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the list of users.
     */
    onLoadUsers: (state, { payload }) => {
      state.isLoadingUsers = false;
      state.users = payload;
    },
    /**
     * Resets the user state when the user logs out.
     *
     * This reducer is used when the user logs out. It resets the state
     * of the user module to its initial value.
     *
     * @param {Object} state The current state of the reducer.
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
