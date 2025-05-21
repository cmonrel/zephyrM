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

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onSetActiveUser: (state, { payload }: PayloadAction<User>) => {
      state.activeUser = payload;
    },
    onAddNewUser: (state, { payload }: PayloadAction<User>) => {
      state.users.push(payload);
      state.activeUser = null;
    },
    onUpdateUser: (state, { payload }: PayloadAction<User>) => {
      state.users = state.users.map((user) => {
        if (user.uid === payload.uid) return payload;
        return user;
      });
    },
    onDeleteUser: (state) => {
      if (state.activeUser) {
        state.users = state.users.filter(
          (user) => user.uid !== state.activeUser.uid
        );
        state.activeUser = null;
      }
    },
    onLoadUsers: (state, { payload }: PayloadAction<User[]>) => {
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
