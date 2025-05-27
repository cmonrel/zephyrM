/**
 * Notification store hook.
 *
 * Custom hook for managing notifications within the application.
 *
 * @module hooks/useNotificationStore
 */

import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import zephyrmApi from "../apis/zephyrMAPI";
import {
  onCreateNotification,
  onDeleteNotification,
  onLoadNotifications,
  onMarkNotificationRead,
} from "../store";
import { useAuthStore } from "../auth/hooks/useAuthStore";
import { useAssetsStore } from "../modules/assetsModule";

/**
 * This hook provides functions to create, delete, and update notifications
 * for various events and user actions. It interacts with the server to
 * update notification data and dispatches Redux actions to update the
 * application's state.
 *
 * Methods:
 * - `startDeletingNotification(nid)`: Deletes a notification by its ID.
 * - `markNotificationRead(noti)`: Marks a single notification as read.
 * - `markAllAsRead(notis)`: Marks all provided notifications as read.
 * - `startCreatingNotification(event)`: Creates a new notification based
 *   on an event.
 * - `startSendingNotificationRequest(asset)`: Sends a new request
 *   notification for an asset to admin users.
 * - `startSendingRequestResponseNotification(status, request)`: Sends a
 *   notification for a request response.
 *
 * These methods handle server communication and manage the application's
 * notification state via Redux.
 *
 * @returns {object} An object containing the following methods:
 * - `markAllAsRead(notis)`: Marks all provided notifications as read.
 * - `markNotificationRead(noti)`: Marks a single notification as read.
 * - `startCreatingNotification(event)`: Creates a new notification based
 *   on an event.
 * - `startDeletingNotification(nid)`: Deletes a notification by its ID.
 * - `startSendingNotificationRequest(asset)`: Sends a new request
 *   notification for an asset to admin users.
 * - `startSendingRequestResponseNotification(status, request)`: Sends a
 *   notification for a request response.
 */
export const useNotificationStore = () => {
  const dispatch = useDispatch();
  const { user, startLoadingNotifications } = useAuthStore();
  const { assets } = useAssetsStore();
  const { users } = useSelector((state) => state.user);

  /**
   * Deletes a notification by its ID. Dispatches Redux actions to update the
   * application's state and notifies the user of any errors.
   *
   * @param {string} nid - The ID of the notification to delete.
   *
   * @returns {Promise<void>} A promise that resolves if the notification is
   * deleted successfully or rejects if there is an error.
   */
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

  /**
   * Marks a specific notification as read.
   *
   * This function updates a notification's "read" status to true and
   * communicates with the server to persist the change. After successfully
   * updating, it dispatches actions to update the application's state.
   *
   * @param {object} noti - The notification object to mark as read,
   *   containing an ID and other notification details.
   *
   * @returns {Promise<void>} A promise that resolves when the notification
   * is successfully marked as read, or rejects if an error occurs.
   */

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

  /**
   * Marks all notifications as read.
   *
   * This function takes a list of notification objects and updates their
   * "read" status to true. After successfully updating, it dispatches
   * actions to update the application's state.
   *
   * @param {array} notis - An array of notification objects to mark as
   *   read, each containing an ID and other notification details.
   *
   * @returns {Promise<void>} A promise that resolves when all
   *   notifications are successfully marked as read, or rejects if an
   *   error occurs.
   */
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

  /**
   * Creates a new notification and schedules it with the given event.
   *
   * This function takes an event object and creates a new notification
   * object with the event's title, description, and start date. It then
   * schedules the event with the given user and creates the notification.
   * If the user is the same as the current user, it dispatches an action
   * to create the notification. Finally, it starts loading notifications
   * for the current user.
   *
   * @param {object} event - An event object with title, description, start
   *   date, and user details.
   *
   * @returns {Promise<void>} A promise that resolves if the notification is
   *   successfully created and scheduled, or rejects if an error occurs.
   */
  const startCreatingNotification = async (event) => {
    const newNotification = {
      title: event.title,
      description: event.description,
      event: event,
      user: event.user.uid,
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
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Sends a notification to all admin users when a new request is made
   *
   * This function takes an asset object and creates a new notification
   * for all admin users with the asset's title and description. It then
   * uses the zephyrmApi to send the notification to the server and adds
   * the new notification to the current user's notifications if the
   * current user is an admin. Finally, it starts loading notifications
   * for the current user.
   *
   * @param {object} asset - An asset object with title and description.
   *
   * @returns {Promise<void>} A promise that resolves if the notification is
   *   successfully sent, or rejects if an error occurs.
   */
  const startSendingNotificationRequest = async (asset) => {
    const adminUsers = users.filter((user) => user.role === "admin");

    const newNotification = {
      title: "New Request",
      description: "New request for " + asset.title,
      user: adminUsers.map((user) => user.uid),
      asset: asset,
    };

    try {
      await zephyrmApi.post("notifications/new", newNotification);
      newNotification.user.forEach((uid) => {
        if (uid === user.uid) {
          dispatch(onCreateNotification(newNotification));
        }
      });
      startLoadingNotifications(user.uid);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Sends a notification to a user when their request is responded to
   *
   * This function takes the status of the request and the request object
   * and creates a new notification for the user with the asset's title and
   * description. It then uses the zephyrmApi to send the notification to the
   * server and adds the new notification to the current user's notifications
   * if the current user is the same as the user who made the request. Finally,
   * it starts loading notifications for the current user.
   *
   * @param {string} status - The status of the request.
   * @param {object} request - The request object with title, description, and
   *   user details.
   *
   * @returns {Promise<void>} A promise that resolves if the notification is
   *   successfully sent, or rejects if an error occurs.
   */
  const startSendingRequestResponseNotification = async (status, request) => {
    try {
      const assetRequest = await assets.find(
        (asset) => asset.aid === request.asset
      );

      const newNotification = {
        title: "Request Response",
        description: `Request for ${request.title} was ${status}`,
        user: [request.user],
        asset: assetRequest,
      };

      await zephyrmApi.post("notifications/new", newNotification);
      newNotification.user.forEach((uid) => {
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
    // Methods
    markAllAsRead,
    markNotificationRead,
    startCreatingNotification,
    startDeletingNotification,
    startSendingNotificationRequest,
    startSendingRequestResponseNotification,
  };
};
