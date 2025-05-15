import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import zephyrmApi from "../apis/zephyrMAPI";
import {
  onCreateNotification,
  onDeleteNotification,
  onLoadNotifications,
  onMarkNotificationRead,
} from "../store";
import { useAuthStore } from "../auth/hooks/useAuthStore";

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
    console.log(newNotification);

    const schedule = {
      event: newNotification.event.eid,
      user: newNotification.user,
    };
    console.log(schedule);

    try {
      await zephyrmApi.post("events/schedule", schedule);
      await zephyrmApi.post("notifications/new", newNotification);

      if (newNotification.user === user.uid) {
        dispatch(onCreateNotification(newNotification));
      }
      startLoadingNotifications(user.uid);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    // Params

    // Methods
    markAllAsRead,
    markNotificationRead,
    startCreatingNotification,
    startDeletingNotification,
  };
};
