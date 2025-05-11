import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoadingUsers: true,
    users: [],
    activeUser: null,
  },
  reducers: {
    onSetActiveUser: (state, { payload }) => {
      state.activeUser = payload;
    },
    onAddNewUser: (state, { payload }) => {
      state.users.push(payload);
      state.activeUser = null;
    },
    onUpdateUser: (state, { payload }) => {
      state.users = state.users.map((user) => {
        if (user.uid === payload.uid) return payload;
        return user;
      });
    },
    onDeleteUser: (state) => {
      if (state.activeUser) {
        state.users = state.users.filter(
          (user) => user.id !== state.activeUser.id
        );
      }
      state.activeUser = null;
    },
    onLoadUsers: (state, { payload }) => {
      state.isLoadingUsers = false;
      state.users = payload;
    },
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
