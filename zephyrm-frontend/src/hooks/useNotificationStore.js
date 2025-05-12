import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import { getEnvVariables } from "../helpers/getEnvVariables";

import zephyrmApi from "../apis/zephyrMAPI";
import {
  onCreateNotification,
  onDeleteNotification,
  onLoadNotifications,
  onMarkNotificationRead,
} from "../store";
import { useAuthStore } from "../auth/hooks/useAuthStore";

const { VITE_API_URL } = getEnvVariables();

export const useNotificationStore = () => {
  const dispatch = useDispatch();
  const { user, startLoadingNotifications } = useAuthStore();

  const startDeletingNotification = async (nid) => {
    try {
      await zephyrmApi.delete(`notifications/${nid}`);

      dispatch(onDeleteNotification(nid));
      dispatch(onLoadNotifications());
    } catch (error) {
      console.log(error);
      Swal.fire("Error deleting", error.response.data.msg, "error");
    }
  };

  const markNotificationRead = async (noti) => {
    const readNotification = { ...noti, read: true };
    try {
      await zephyrmApi.put(`notifications/read/${noti.nid}`, readNotification);

      dispatch(onMarkNotificationRead(noti.nid));
      dispatch(onLoadNotifications());
    } catch (error) {
      console.log(error);
      Swal.fire("Error marking as read", error.response.data.msg, "error");
    }
  };

  const markAllAsRead = async (notis) => {
    const notisUpdated = notis.map((noti) => {
      return { ...noti, read: true };
    });

    try {
      await zephyrmApi.put(`notifications/read`, notisUpdated);

      notisUpdated.forEach((noti) => {
        dispatch(onMarkNotificationRead(noti.nid));
      });
      dispatch(onLoadNotifications());
    } catch (error) {
      console.log(error);
      Swal.fire("Error marking as read", error.response.data.msg, "error");
    }
  };

  const startCreatingNotification = async (event) => {
    const newNotification = {
      title: event.title,
      description: event.description,
      event: event,
      user: event.user.uid,
    };

    // const notifyTime = event.start - 30 * 60 * 1000;

    try {
      await zephyrmApi.post("notifications/new", newNotification);

      if (newNotification.user === user.uid) {
        dispatch(onCreateNotification(newNotification));
      }
      startLoadingNotifications(user.uid);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSSENotifications = (uid) => {
    // Create new EventSource connection
    const apiBaseUrl = VITE_API_URL;
    const token = localStorage.getItem("token");
    const newEventSource = new EventSource(
      `${apiBaseUrl}/notifications/stream/${uid}?token=${token}`
    );
    console.log(newEventSource);
    newEventSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "NEW_NOTIFICATION") {
        startCreatingNotification(data.notification);
        // Optional: Show browser notification
        if (Notification.permission === "granted") {
          new Notification("New Notification", {
            body: data.notification.message,
          });
        }
      }
    };

    newEventSource.onerror = () => {
      console.log("SSE error - attempting reconnect...");
      newEventSource.close();
      // Implement reconnect logic here if needed
    };

    return () => {
      newEventSource.close();
    };
  };

  return {
    // Params

    // Methods
    handleSSENotifications,
    markAllAsRead,
    markNotificationRead,
    startCreatingNotification,
    startDeletingNotification,
  };
};
