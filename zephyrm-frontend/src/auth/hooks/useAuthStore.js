/**
 * Authentication store hook.
 *
 * Provides authentication state and actions to components.
 *
 * @module auth/hooks/useAuthStore
 */

import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "../../store/auth/authSlice";
import { onLogoutCalendar } from "../../store/calendar/calendarSlice";
import zephyrmApi from "../../apis/zephyrMAPI";
import {
  onLoadNotifications,
  onLogoutAssets,
  onLogoutNotifications,
} from "../../store";
import { onLogoutUsers } from "../../store";
import { onLogoutRequests } from "../../store/request/requestSlice";
import { onLogoutCategories } from "../../store/assetsModule/categoriesSlice";

/**
 * Custom hook for managing authentication state and actions.
 *
 * This hook provides authentication-related state variables and functions
 * to handle login, logout, token renewal, and notifications loading.
 * It utilizes Redux for state management and interacts with the API
 * to perform authentication and fetch notifications.
 *
 * @returns {Object} An object containing authentication state and methods:
 * - status: Current authentication status ('checking', 'not-authenticated', or 'authenticated').
 * - user: Object containing user information.
 * - errorMessage: Error message if any authentication error occurs.
 * - notifications: List of user notifications.
 * - startLogin: Function to initiate user login with email and password.
 * - checkAuthToken: Function to verify and renew authentication token.
 * - startLogout: Function to log out the user and clear authentication data.
 * - startLoadingNotifications: Function to load user notifications.
 */

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  /**
   * Initiates the user login process using the provided email and password.
   *
   * Dispatches the onChecking action to indicate that the authentication process is in progress.
   * Attempts to authenticate the user by sending a POST request to the server with the email and password.
   * If successful, stores the received authentication token and token initialization date in localStorage.
   * Dispatches the onLogin action with the user's name, uid, role, and counter to update the authentication state.
   * Calls startLoadingNotifications to load notifications for the authenticated user.
   * Returns the received authentication token.
   * If an error occurs during login, checks if the counter reaches 5 and attempts to block the user.
   * Dispatches the onLogout action with an error message in case of failure.
   * Clears any authentication error messages after a timeout.
   *
   * @param {Object} credentials - The user's login credentials.
   * @param {string} credentials.email - The user's email address.
   * @param {string} credentials.password - The user's password.
   * @returns {Promise<string>} The authentication token if login is successful, otherwise handles errors appropriately.
   */

  const startLogin = async ({ email, password }) => {
    dispatch(onChecking());
    try {
      const { data } = await zephyrmApi.post("/auth", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      dispatch(
        onLogin({
          name: data.name,
          uid: data.uid,
          role: data.role,
          counter: data.counter,
        })
      );

      startLoadingNotifications(data.uid);

      return data.token;
    } catch (error) {
      if (error.response.data.counter === 5) {
        try {
          await zephyrmApi.post("/auth/block", { email });
          dispatch(onLogout(error.response.data?.msg));
        } catch (err) {
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
   * Checks the authentication token and renews it if it exists.
   *
   * First, it checks if the token exists in local storage. If it doesn't, it
   * logs the user out. If the token exists, it attempts to renew it by sending
   * a GET request to the server. If the renewal is successful, it updates the
   * token and its initialization date in local storage and loads the user's
   * notifications. If the renewal fails, it clears local storage and logs the
   * user out.
   * @returns {Promise<string>} The renewed authentication token if the
   * renewal is successful, otherwise handles errors appropriately.
   */
  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout());

    try {
      const { data } = await zephyrmApi.get("auth/renew");
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      startLoadingNotifications(data.uid);
      dispatch(onLogin({ name: data.name, uid: data.uid, role: data.role }));
      return data.token;
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
      console.log(error);
    }
  };

  /**
   * Logs the user out of the application by clearing local storage and
   * resetting all related states to their initial values.
   */
  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogoutAssets());
    dispatch(onLogoutUsers());
    dispatch(onLogoutNotifications());
    dispatch(onLogoutRequests());
    dispatch(onLogoutCategories());
    dispatch(onLogout());
  };

  /**
   * Loads user notifications by making a GET request to the server.
   *
   * First, it logs out from notifications to prevent any previous data
   * from being used. Then, it attempts to fetch the user notifications
   * by sending a GET request to the server with the user uid. If the
   * request is successful, it dispatches the onLoadNotifications action
   * with the received notifications to update the notifications state.
   * If an error occurs during the request, it displays an error message
   * using Swal.fire.
   * @param {string} uid - The user's uid.
   */
  const startLoadingNotifications = async (uid) => {
    dispatch(onLogoutNotifications());
    try {
      const { data } = await zephyrmApi.get(`notifications/${uid}`);
      dispatch(onLoadNotifications(data.notifications));
    } catch (error) {
      Swal.fire(
        "Error loading notifications",
        error.response.data.msg,
        "error"
      );
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
