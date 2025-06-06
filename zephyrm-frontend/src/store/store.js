/**
 * Redux store
 *
 * This file contains the Redux store configuration for the application.
 *
 * @module store/store
 */

import { configureStore } from "@reduxjs/toolkit";
import {
  authSlice,
  calendarSlice,
  notificationsSlice,
  uiSlice,
  userSlice,
} from "./";
import { assetsSlice } from "./assetsModule/assetsSlice";
import { requestSlice } from "./request/requestSlice";
import { categoriesSlice } from "./assetsModule/categoriesSlice";

/**
 * Configures the Redux store for the application.
 *
 * @returns {Object} The configured Redux store.
 */
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    calendar: calendarSlice.reducer,
    ui: uiSlice.reducer,
    user: userSlice.reducer,
    assets: assetsSlice.reducer,
    notifications: notificationsSlice.reducer,
    request: requestSlice.reducer,
    categories: categoriesSlice.reducer,
  },
  /**
   * Middleware configuration for the store.
   *
   * @param {Function} getDefaultMiddleware A function that returns the default
   *                                        middleware for the store.
   *
   * @returns {Array} An array of middleware functions to use in the store.
   *
   * The `serializableCheck` middleware option is disabled to prevent errors
   * when using non-serializable objects in actions.
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
