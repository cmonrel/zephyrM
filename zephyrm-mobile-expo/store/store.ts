/**
 * Store
 *
 * @module store/store
 */

import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { assetsSlice } from "./assetsModule/assetsSlice";
import { categoriesSlice } from "./assetsModule/categoriesSlice";
import { authSlice } from "./auth/authSlice";
import { calendarSlice } from "./calendar/calendarSlice";
import { notificationsSlice } from "./notifications/notificationsSlice";
import { requestSlice } from "./requests/requestSlice";
import { uiSlice } from "./ui/uiSlice";
import { userSlice } from "./user/userSlice";

/**
 * The Redux store configuration.
 */
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    calendar: calendarSlice.reducer,
    ui: uiSlice.reducer,
    user: userSlice.reducer,
    assets: assetsSlice.reducer,
    notifications: notificationsSlice.reducer,
    requests: requestSlice.reducer,
    categories: categoriesSlice.reducer,
  },
  /**
   * The middleware configuration for the store.
   *
   * The {@function getDefaultMiddleware} is used to
   * generate the default middleware configuration. The serializable check is disabled, as it is not useful for this
   * application.
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
