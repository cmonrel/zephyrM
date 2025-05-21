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

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
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
    onCreateNotification: (state, { payload }) => {
      state.notifications.push(payload);
    },
    onDeleteNotification: (state, { payload }: PayloadAction<string>) => {
      if (payload) {
        state.notifications = state.notifications.filter(
          (notification) => notification.nid !== payload
        );
      }
    },
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
