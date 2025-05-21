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

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = "checking";
      state.user = initialState.user;
      state.errorMessage = undefined;
    },
    onLogin: (state, { payload }: PayloadAction<AuthUser>) => {
      state.status = "authenticated";
      state.user = payload;
      state.errorMessage = undefined;
    },
    onLogout: (state, { payload }: PayloadAction<string>) => {
      state.status = "not-authenticated";
      state.user = initialState.user;
      state.errorMessage = payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
});

// Action creators are generated for each case reducer function
export const { clearErrorMessage, onChecking, onLogin, onLogout } =
  authSlice.actions;
