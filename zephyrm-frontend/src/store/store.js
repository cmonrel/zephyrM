import { configureStore } from "@reduxjs/toolkit";
import { authSlice, calendarSlice, uiSlice, userSlice } from "./";
import { assetsSlice } from "./assetsModule/assetsSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    calendar: calendarSlice.reducer,
    ui: uiSlice.reducer,
    user: userSlice.reducer,
    assets: assetsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
