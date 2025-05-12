import { createSlice } from "@reduxjs/toolkit";
export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    isLoadingNotifications: true,
    notifications: [],
  },
  reducers: {
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
    },
    onCreateNotification: (state, { payload }) => {
      state.notifications.push(payload);
    },
    onDeleteNotification: (state, { payload }) => {
      if (payload) {
        state.notifications = state.notifications.filter(
          (notification) => notification.nid !== payload
        );
      }
    },
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
