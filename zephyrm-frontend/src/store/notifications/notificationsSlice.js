/**
 * Notifications slice
 *
 * This slice contains the state and reducers for the notifications module.
 *
 * @module store/notifications/notificationsSlice
 */

import { createSlice } from "@reduxjs/toolkit";

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    isLoadingNotifications: true,
    notifications: [],
  },
  reducers: {
    /**
     * Loads notifications from the server.
     *
     * This reducer is used when all notifications are loaded from the server.
     * It receives the list of notifications as a payload and sets the state
     * with that list. It also sets isLoadingNotifications to false to
     * indicate that the notifications have been loaded.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the list of notifications.
     */
    onLoadNotifications: (state, { payload = [] }) => {
      state.isLoadingNotifications = false;
      payload.forEach((notification) => {
        const exists = state.notifications.some(
          (dbNotification) => dbNotification.nid === notification.nid
        );
        if (!exists) {
          state.notifications.push(notification);
        }
      });
      state.notifications.sort(
        (a, b) => new Date(a.creationDate) - new Date(b.creationDate)
      );
    },
    /**
     * Adds a new notification to the list of notifications.
     *
     * This reducer is used when a new notification is created. It receives the new
     * notification object as a payload and adds it to the list of notifications
     * in the state.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the new notification object.
     */
    onCreateNotification: (state, { payload }) => {
      state.notifications.push(payload);
    },
    /**
     * Deletes a notification from the list of notifications.
     *
     * This reducer is used when a notification is deleted. It receives the ID of
     * the notification to delete as a payload and deletes the notification from
     * the list of notifications in the state.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the ID of the notification to delete.
     */
    onDeleteNotification: (state, { payload }) => {
      if (payload) {
        state.notifications = state.notifications.filter(
          (notification) => notification.nid !== payload
        );
      }
    },
    /**
     * Marks a notification as read.
     *
     * This reducer is used when a notification is marked as read. It receives the
     * ID of the notification as a payload and updates the notification's "read"
     * status to true in the state.
     *
     * @param {Object} state The current state of the reducer.
     * @param {Object} { payload } The payload with the ID of the notification to mark as read.
     */
    onMarkNotificationRead: (state, { payload }) => {
      if (payload) {
        state.notifications = state.notifications.map((notification) => {
          if (notification.nid === payload) {
            notification.read = true;
          }
          return notification;
        });
      }
    },
    /**
     * Resets the notifications state when the user logs out.
     *
     * This reducer is used when the user logs out. It resets the state of the
     * notifications module to its initial value, setting isLoadingNotifications
     * to true and clearing the list of notifications.
     *
     * @param {Object} state The current state of the reducer.
     */
    onLogoutNotifications: (state) => {
      state.isLoadingNotifications = true;
      state.notifications = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onCreateNotification,
  onLoadNotifications,
  onDeleteNotification,
  onMarkNotificationRead,
  onLogoutNotifications,
} = notificationsSlice.actions;
