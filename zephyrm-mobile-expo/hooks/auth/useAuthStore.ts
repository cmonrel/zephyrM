import * as SecureStorage from "expo-secure-store";
import { useSelector } from "react-redux";

import { Alert } from "react-native";
import { zephyrmApi } from "../../apis";
import { onLogoutAssets } from "../../store/assetsModule/assetsSlice";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "../../store/auth/authSlice";
import { onLogoutCalendar } from "../../store/calendar/calendarSlice";
import {
  onLoadNotifications,
  onLogoutNotifications,
} from "../../store/notifications/notificationsSlice";
import { onLogoutRequests } from "../../store/requests/requestSlice";
import { useAppDispatch } from "../../store/store";
import { onLogoutUsers } from "../../store/user/userSlice";

export const useAuthStore = () => {
  const dispatch = useAppDispatch();
  const { status, user, errorMessage } = useSelector(
    (state: any) => state.auth
  );
  const { notifications } = useSelector((state: any) => state.notifications);
  const storedKeys: string[] = ["token", "token-init-date"];

  const startLogin = async (email: string, password: string) => {
    dispatch(onChecking());
    try {
      const { data } = await zephyrmApi.post("/auth", {
        email,
        password,
      });
      SecureStorage.setItem("token", data.token);
      SecureStorage.setItem("token-init-date", new Date().getTime().toString());

      dispatch(
        onLogin({
          name: data.name,
          uid: data.uid,
          counter: data.counter,
          role: data.role,
        })
      );

      startLoadingNotifications(data.uid);
      return data.token;
    } catch (error: any) {
      console.log(error);
      if (error.response.data.counter === 5) {
        try {
          await zephyrmApi.post("/auth/block", { email });
          dispatch(onLogout(error.response.data?.msg));
        } catch (err: any) {
          dispatch(onLogout(err.response.data?.msg));
        }
      }
      dispatch(onLogout(error.response.data?.msg));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    try {
      const { data } = await zephyrmApi.get("auth/renew");
      SecureStorage.setItem("token", data.token);
      SecureStorage.setItem("token-init-date", new Date().getTime().toString());

      startLoadingNotifications(data.uid);
      dispatch(
        onLogin({
          name: data.name,
          uid: data.uid,
          counter: data.counter,
          role: user.role,
        })
      );
    } catch (error: any) {
      console.log(error);
      startDeletingSecureStore();
      dispatch(onLogout(error.response.data?.msg));
    }
  };

  const startLogout = () => {
    startDeletingSecureStore();
    dispatch(onLogoutCalendar());
    dispatch(onLogoutAssets());
    dispatch(onLogoutUsers());
    dispatch(onLogoutNotifications());
    dispatch(onLogoutRequests());
    dispatch(onLogout(""));
  };

  const startLoadingNotifications = async (uid: string) => {
    dispatch(onLogoutNotifications());
    try {
      const { data } = await zephyrmApi.get(`notifications/${uid}`);
      dispatch(onLoadNotifications(data.notifications));
    } catch (error: any) {
      Alert.alert("Error loading notifications", error.response.data.msg);
    }
  };

  const startDeletingSecureStore = async () => {
    for (const key of storedKeys) {
      await SecureStorage.deleteItemAsync(key);
    }
  };

  return {
    // Properties
    errorMessage,
    notifications,
    status,
    user,

    // Methods
    checkAuthToken,
    startLoadingNotifications,
    startLogin,
    startLogout,
  };
};
