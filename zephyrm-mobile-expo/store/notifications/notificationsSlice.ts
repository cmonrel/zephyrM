/**
 * Notifications slice
 *
 * @module store/notifications/notificationsSlice
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotificationInter } from "../../interfaces";

interface NotificationState {
  isLoadingNotifications: boolean;
  notifications: NotificationInter[];
}

const initialState: NotificationState = {
  isLoadingNotifications: true,
  notifications: [],
};

/**
 * This slice contains the state and reducers for the notifications module.
 */
export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    /**
     * Loads notifications into the state.
     *
     * This reducer sets `isLoadingNotifications` to false, indicating that
     * notifications are no longer being loaded. It then iterates over the
     * provided notifications in the payload and adds them to the state if
     * they do not already exist, based on their unique `nid`.
     *
     * @param {NotificationState} state - The current state of the notifications slice.
     * @param {PayloadAction<NotificationInter[]>} payload - An array of notifications to be loaded.
     */
    onLoadNotifications: (
      state,
      { payload = [] }: PayloadAction<NotificationInter[]>
    ) => {
      state.isLoadingNotifications = false;
      payload.forEach((notification) => {
        const exists = state.notifications.some(
          (dbNotification) => dbNotification.nid === notification.nid
        );
        if (!exists) {
          state.notifications.push(notification);
        }
      });
    },

    /**
     * Adds a new notification to the state.
     *
     * This reducer is used when a new notification is created. It receives the new
     * notification object as a payload and adds it to the list of notifications in
     * the state.
     *
     * @param {NotificationState} state - The current state of the notifications slice.
     * @param {PayloadAction<NotificationInter>} { payload } - The payload with the new notification object.
     */
    onCreateNotification: (state, { payload }) => {
      state.notifications.push(payload);
    },

    /**
     * Deletes a notification from the state by its ID.
     *
     * This reducer is used to remove a notification from the list of notifications
     * in the state. It receives the ID of the notification to be deleted as a payload
     * and filters the notifications array to exclude the notification with the
     * matching ID.
     *
     * @param {NotificationState} state - The current state of the notifications slice.
     * @param {PayloadAction<string>} payload - The ID of the notification to be deleted.
     */
    onDeleteNotification: (state, { payload }: PayloadAction<string>) => {
      if (payload) {
        state.notifications = state.notifications.filter(
          (notification) => notification.nid !== payload
        );
      }
    },

    /**
     * Marks a notification as read in the state.
     *
     * This reducer is used to update the read status of a specific notification
     * within the list of notifications in the state. It receives the ID of the
     * notification to be marked as read as a payload and iterates over the
     * notifications array to find the matching notification and set its read
     * property to true.
     *
     * @param {NotificationState} state - The current state of the notifications slice.
     * @param {PayloadAction<string>} payload - The ID of the notification to mark as read.
     */
    onMarkNotificationRead: (state, { payload }: PayloadAction<string>) => {
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
     * This reducer is used when the user logs out. It resets the state
     * of the notifications module to its initial value, setting isLoadingNotifications
     * to true and clearing the list of notifications.
     *
     * @param {NotificationState} state The current state of the reducer.
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
