/**
 * Notification store hook
 *
 * @module hooks/notifications/useNotificationStore
 */

import { Alert } from "react-native";
import { useSelector } from "react-redux";
import { zephyrmApi } from "../../apis";
import { Asset, EventInter, NotificationInter } from "../../interfaces";
import { User } from "../../interfaces/login/userInterface";
import { RequestInter } from "../../interfaces/request/requestInterface";
import {
  onCreateNotification,
  onDeleteNotification,
  onLoadNotifications,
  onMarkNotificationRead,
} from "../../store/notifications/notificationsSlice";
import { useAppDispatch } from "../../store/store";
import { useAuthStore } from "../auth/useAuthStore";

/**
 * Notification store hook
 *
 * @function
 * @returns {object} Hook object with methods:
 *  - `markAllAsRead`: Marks all notifications as read.
 *  - `markNotificationRead`: Marks a notification as read.
 *  - `startCreatingNotification`: Creates a new notification for an event.
 *  - `startDeletingNotification`: Deletes a notification.
 *  - `startSendingNotificationRequest`: Sends a notification for a new request.
 *  - `startSendingRequestResponseNotification`: Sends a notification when a request is responded to.
 */
export const useNotificationStore = () => {
  const dispatch = useAppDispatch();
  const { user, startLoadingNotifications } = useAuthStore();
  const { users } = useSelector((state: any) => state.user);
  const { assets } = useSelector((state: any) => state.assets);

  /**
   * Deletes a notification by its ID.
   *
   * Makes a DELETE request to the server to delete a notification with the
   * specified ID. If the request is successful, it dispatches the
   * onDeleteNotification action with the ID of the deleted notification and
   * a list of notifications. If an error occurs, it displays an error alert.
   *
   * @param {string} nid - Notification ID.
   */
  const startDeletingNotification = async (nid: string) => {
    try {
      await zephyrmApi.delete(`notifications/${nid}`);

      dispatch(onDeleteNotification(nid));
      dispatch(onLoadNotifications([]));
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error deleting", error.response.data.msg);
    }
  };

  /**
   * Marks a notification as read.
   *
   * Makes a PUT request to the server to update a notification with the
   * specified ID. If the request is successful, it dispatches the
   * onMarkNotificationRead action with the ID of the read notification and
   * a list of notifications. If an error occurs, it displays an error alert.
   *
   * @param {NotificationInter} noti - Notification to mark as read.
   */
  const markNotificationRead = async (noti: NotificationInter) => {
    const readNotification = { ...noti, read: true };
    try {
      await zephyrmApi.put(`notifications/read/${noti.nid}`, readNotification);

      dispatch(onMarkNotificationRead(noti.nid!));
      dispatch(onLoadNotifications([]));
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error marking as read", error.response.data.msg);
    }
  };

  /**
   * Marks all notifications as read.
   *
   * Makes a PUT request to the server to update all notifications with the
   * specified IDs. If the request is successful, it dispatches the
   * onMarkNotificationRead action with the ID of the read notifications and
   * a list of notifications. If an error occurs, it displays an error alert.
   *
   * @param {NotificationInter[]} notis - Array of notifications to mark as read.
   */
  const markAllAsRead = async (notis: NotificationInter[]) => {
    const notisUpdated = notis.map((noti) => {
      return { ...noti, read: true };
    });

    try {
      await zephyrmApi.put(`notifications/read`, notisUpdated);

      notisUpdated.forEach((noti) => {
        dispatch(onMarkNotificationRead(noti.nid!));
      });
      dispatch(onLoadNotifications([]));
    } catch (error: any) {
      console.log(error);
      Alert.alert("Error marking as read", error.response.data.msg);
    }
  };

  /**
   * Creates a notification for an event and schedules it.
   *
   * @param {EventInter} event - The event for which the notification is created.
   *
   * @remarks
   * This function posts the event and user details to the schedule endpoint,
   * and creates a new notification with the event details. If the user is the
   * current user, the notification is dispatched to the store. After creating
   * the notification, it reloads the user's notifications. If an error occurs,
   * it logs the error to the console.
   */
  const startCreatingNotification = async (event: EventInter) => {
    const newNotification = {
      title: event.title,
      description: event.description,
      event: event,
      user: event.user?.uid,
      eventDate: event.start,
    };

    const schedule = {
      event: newNotification.event.eid,
      user: newNotification.user,
    };

    try {
      await zephyrmApi.post("events/schedule", schedule);
      await zephyrmApi.post("notifications/new", newNotification);

      if (newNotification.user === user.uid) {
        dispatch(onCreateNotification(newNotification));
      }
      startLoadingNotifications(user.uid);
    } catch (error: any) {
      console.log(error);
    }
  };

  /**
   * Sends a notification to all admins when a new request is created.
   *
   * Makes a POST request to the server to create a new notification with the
   * specified asset and a list of admin users. If the request is successful, it
   * dispatches the onCreateNotification action with the new notification and
   * reloads the user's notifications. If an error occurs, it logs the error to
   * the console.
   *
   * @param {Asset} asset - The asset for which the request is created.
   */
  const startSendingNotificationRequest = async (asset: Asset) => {
    const adminUsers: User[] = users.filter(
      (user: User) => user.role === "admin"
    );

    const newNotification: NotificationInter = {
      title: "New Request",
      description: "New request for " + asset.title,
      user: adminUsers.map((user: User) => user.uid),
      asset: asset,
    };

    try {
      await zephyrmApi.post("notifications/new", newNotification);
      newNotification.user.forEach((uid: string) => {
        if (uid === user.uid) {
          dispatch(onCreateNotification(newNotification));
        }
      });
      startLoadingNotifications(user.uid);
    } catch (error: any) {
      console.log(error);
    }
  };

  /**
   * Sends a notification to the user when a request is accepted or denied.
   *
   * Makes a POST request to the server to create a new notification with the
   * specified request and status. If the request is successful, it dispatches
   * the onCreateNotification action with the new notification and reloads the
   * user's notifications. If an error occurs, it logs the error to the console
   * and throws an error.
   *
   * @param {string} status - The status of the request ("Approved" or "Denied").
   * @param {RequestInter} request - The request to be accepted or denied.
   */
  const startSendingRequestResponseNotification = async (
    status: string,
    request: RequestInter
  ) => {
    try {
      const assetRequest = await assets.find(
        (asset: Asset) => asset.aid === request.asset
      );

      const newNotification: NotificationInter = {
        title: "Request Response",
        description: `Request for ${request.title} was ${status}`,
        user: [request.user],
        asset: assetRequest,
      };

      await zephyrmApi.post("notifications/new", newNotification);
      newNotification.user.forEach((uid: string) => {
        if (uid === user.uid) {
          dispatch(onCreateNotification(newNotification));
        }
      });
      startLoadingNotifications(user.uid);
    } catch (error) {
      console.log(error);
      throw new Error("Error sending request response notification");
    }
  };

  return {
    // Params

    // Methods
    markAllAsRead,
    markNotificationRead,
    startCreatingNotification,
    startDeletingNotification,
    startSendingNotificationRequest,
    startSendingRequestResponseNotification,
  };
};
