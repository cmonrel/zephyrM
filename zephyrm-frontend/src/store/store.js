import { configureStore } from "@reduxjs/toolkit";
import {
  authSlice,
  calendarSlice,
  notificationsSlice,
  uiSlice,
  userSlice,
} from "./";
import { assetsSlice } from "./assetsModule/assetsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    calendar: calendarSlice.reducer,
    ui: uiSlice.reducer,
    user: userSlice.reducer,
    assets: assetsSlice.reducer,
    notifications: notificationsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
