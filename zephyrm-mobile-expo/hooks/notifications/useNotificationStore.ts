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

export const useNotificationStore = () => {
  const dispatch = useAppDispatch();
  const { user, startLoadingNotifications } = useAuthStore();
  const { users } = useSelector((state: any) => state.user);
  const { assets } = useSelector((state: any) => state.assets);

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

  const startCreatingNotification = async (event: EventInter) => {
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
    } catch (error: any) {
      console.log(error);
    }
  };

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
