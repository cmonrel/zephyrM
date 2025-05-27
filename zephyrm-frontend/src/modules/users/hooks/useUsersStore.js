/**
 * Users store hook
 *
 * Custom hook for managing users within the application
 *
 * @module modules/users/hooks/useUsersStore
 */

import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
  onAddNewUser,
  onDeleteUser,
  onLoadUsers,
  onSetActiveUser,
  onUpdateUser,
} from "../../../store";
import zephyrmApi from "../../../apis/zephyrMAPI";
import { useAuthStore } from "../../../auth/hooks/useAuthStore";
import { useCalendarStore } from "../../calendar";

/**
 * Custom hook for managing users within the application
 *
 * Methods:
 * - `startLoadingUsers()`: Loads all users from the server.
 * - `setActiveUser(user)`: Sets a single user as active.
 * - `startDeletingUser(user)`: Deletes a user by its ID.
 * - `startSavingUser(user)`: Creates a new user or updates an existing one.
 * - `startSavingPassword(user, password)`: Updates a user's password.
 *
 * These methods handle server communication and manage the application's
 * user state via Redux.
 *
 * @returns {object} An object containing the following properties and methods:
 * - `users`: The list of all available users.
 * - `activeUser`: The currently active user.
 * - `hasUserSelected`: A flag indicating whether a user is currently selected.
 * - `setActiveUser(user)`: Sets a single user as active.
 * - `startDeletingUser(user)`: Deletes a user by its ID.
 * - `startSavingUser(user)`: Creates a new user or updates an existing one.
 * - `startSavingPassword(user, password)`: Updates a user's password.
 * - `startLoadingUsers()`: Loads all users from the server.
 */
export const useUsersStore = () => {
  const dispatch = useDispatch();
  const { users, activeUser } = useSelector((state) => state.user);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { startLogout } = useAuthStore();
  const { startDeletingUserEvents } = useCalendarStore();

  /**
   * Sets a single user as active.
   *
   * Dispatches the onSetActiveUser action with the provided user to
   * update the application's state.
   *
   * @param {Object} user The user to be set as active.
   */
  const setActiveUser = (user) => {
    dispatch(onSetActiveUser(user));
  };

  /**
   * Creates a new user or updates an existing one.
   *
   * Makes a POST or PUT request to the server, depending on whether the
   * provided user has an `uid` property. If the request is successful, it
   * dispatches either the `onAddNewUser` or `onUpdateUser` action and shows
   * a success message. If an error occurs, it displays an error message.
   *
   * @param {Object} user The user to be created or updated.
   */
  const startSavingUser = async (user) => {
    try {
      if (user.uid) {
        // Update
        const { data } = await zephyrmApi.put(`users/${user.uid}`, user);

        const updatedUser = {
          name: data.name,
          email: data.email,
          uid: data.uid,
          role: data.role,
        };

        dispatch(onUpdateUser(updatedUser));
        Swal.fire("Saved", "", "success");
        startLoadingUsers();
        return;
      }
      // Create
      const { data } = await zephyrmApi.post("users/new", user);

      dispatch(onAddNewUser({ ...user, uid: data.uid }));
      Swal.fire("Created successfully", "", "success");
      startLoadingUsers();
    } catch (error) {
      error.response.data?.msg &&
        Swal.fire("Error saving", error.response.data?.msg, "error");
    }

    startLoadingUsers();
  };

  /**
   * Loads all users from the server.
   *
   * Makes a GET request to the server to fetch all available users.
   * If the request is successful, it dispatches the `onLoadUsers` action
   * to update the application's state. If an error occurs, it displays
   * an error message.
   */
  const startLoadingUsers = async () => {
    try {
      const { data } = await zephyrmApi.get("users");
      dispatch(onLoadUsers(data.usersMapped));
    } catch (error) {
      console.log("Error loading users");
      console.log(error);
    }
  };

  /**
   * Deletes a user by its ID.
   *
   * Makes a DELETE request to the server to delete a user with the
   * specified ID. If the request is successful, it dispatches the
   * onDeleteUser action to update the application's state, clears the
   * active user, and shows a success message. If the deleted user is
   * the current user, it logs out from the application. If an error
   * occurs, it displays an error message.
   *
   * @param {Object} user The user to be deleted.
   */
  const startDeletingUser = async (user) => {
    if (!user) return;
    try {
      startDeletingUserEvents(user.uid);
      await zephyrmApi.delete(`users/${user.uid}`);
      dispatch(onDeleteUser());
      Swal.fire("Deleted successfully", "", "success");
      startLoadingUsers();
      if (currentUser.uid === user.uid) startLogout();
    } catch (error) {
      Swal.fire("Error deleting", error.response.data.msg, "error");
    }
  };

  /**
   * Saves a new password for a user.
   *
   * Makes a PUT request to the server to update a user with the
   * specified ID. If the request is successful, it dispatches the
   * onUpdateUser action to update the application's state, shows a
   * success message, and reloads the users list. If an error occurs,
   * it displays an error message.
   *
   * @param {Object} user The user to be updated.
   * @param {string} password The new password.
   */
  const startSavingPassword = async (user, password) => {
    try {
      const { data } = await zephyrmApi.put(`users/password/${user.uid}`, {
        password,
      });
      const updatedUser = {
        name: data.name,
        email: data.email,
        uid: data.uid,
        role: data.role,
      };

      dispatch(onUpdateUser(updatedUser));
      Swal.fire("Recover successfully", "", "success");
      startLoadingUsers();
      return;
    } catch (error) {
      console.log({ error });
      Swal.fire(
        "Error saving",
        error.response.data.errors.password?.msg,
        "error"
      );
    }
  };

  return {
    // Properties
    users,
    activeUser,
    hasUserSelected: !!activeUser,

    // Methods
    setActiveUser,
    startDeletingUser,
    startLoadingUsers,
    startSavingPassword,
    startSavingUser,
  };
};
