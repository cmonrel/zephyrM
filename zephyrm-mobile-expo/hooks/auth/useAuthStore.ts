/**
 * Auth store hook
 *
 * @module hooks/auth/useAuthStore
 */

import * as SecureStorage from "expo-secure-store";
import { useSelector } from "react-redux";

import { Alert } from "react-native";
import { zephyrmApi } from "../../apis";
import { onLogoutAssets } from "../../store/assetsModule/assetsSlice";
import { onLogoutCategories } from "../../store/assetsModule/categoriesSlice";
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

/**
 * Custom hook for managing authentication state and actions.
 *
 * This hook provides the current authentication status, user information,
 * and error messages from the authentication process. It also offers
 * methods to log in, log out, check the authentication token, and load
 * notifications.
 *
 * @returns {Object} An object containing:
 * - Properties:
 *   - `status`: The current authentication status.
 *   - `user`: The current authenticated user information.
 *   - `errorMessage`: Any error message related to authentication failures.
 *   - `notifications`: List of notifications for the user.
 * - Methods:
 *   - `startLogin(email: string, password: string)`: Initiates the login
 *     process with the provided email and password.
 *   - `checkAuthToken()`: Checks and renews the authentication token.
 *   - `startLogout()`: Logs out the user and clears stored data.
 *   - `startLoadingNotifications(uid: string)`: Loads notifications for
 *     the specified user ID.
 */

export const useAuthStore = () => {
  const dispatch = useAppDispatch();
  const { status, user, errorMessage } = useSelector(
    (state: any) => state.auth
  );
  const { notifications } = useSelector((state: any) => state.notifications);
  const storedKeys: string[] = ["token", "token-init-date"];

  /**
   * Starts the login process for the user.
   *
   * This function posts a request to the authentication endpoint with the
   * provided email and password. If the request is successful, it saves the
   * authentication token and user information to secure storage and
   * dispatches the onLogin action. It also loads the user's notifications.
   *
   * If the request fails, it dispatches the onLogout action with the error
   * message and clears the error message after 10 seconds.
   *
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @returns {Promise<string>} The authentication token.
   */
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

  /**
   * Checks the authentication token and renews it if necessary.
   *
   * This function makes a GET request to the authentication endpoint to
   * check the token. If the request is successful, it updates the token
   * and user information in secure storage and dispatches the onLogin
   * action. It also loads the user's notifications.
   *
   * If the request fails, it deletes the stored authentication data and
   * dispatches the onLogout action with the error message.
   */
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

  /**
   * Logs out the user and clears stored data.
   *
   * This function deletes secure storage items and dispatches multiple
   * logout actions to clear the application state, including calendar,
   * assets, users, notifications, requests and categories. It also dispatches the
   * onLogout action to update the authentication state to not-authenticated.
   */
  const startLogout = () => {
    startDeletingSecureStore();
    dispatch(onLogoutCalendar());
    dispatch(onLogoutAssets());
    dispatch(onLogoutUsers());
    dispatch(onLogoutNotifications());
    dispatch(onLogoutRequests());
    dispatch(onLogoutCategories());
    dispatch(onLogout(""));
  };

  /**
   * Loads notifications for the user with the specified ID.
   *
   * This function first logs out of the notifications and then makes a GET
   * request to the notifications endpoint with the user ID. If the request
   * is successful, it dispatches the onLoadNotifications action with the
   * list of notifications. If the request fails, it shows an alert with the
   * error message.
   *
   * @param {string} uid - User ID.
   */
  const startLoadingNotifications = async (uid: string) => {
    dispatch(onLogoutNotifications());
    try {
      const { data } = await zephyrmApi.get(`notifications/${uid}`);
      dispatch(onLoadNotifications(data.notifications));
    } catch (error: any) {
      Alert.alert("Error loading notifications", error.response.data.msg);
    }
  };

  /**
   * Deletes all secure storage items.
   *
   * This function iterates over the secure storage keys and deletes each
   * item using the SecureStorage.deleteItemAsync method.
   */
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
