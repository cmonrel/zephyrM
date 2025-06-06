/**
 * Users store hook
 *
 * @module hooks/users/useUsersStore
 */

import { useSelector } from "react-redux";

import { Alert } from "react-native";
import { zephyrmApi } from "../../apis";
import { User } from "../../interfaces/login/userInterface";
import { useAppDispatch } from "../../store/store";
import {
  onAddNewUser,
  onDeleteUser,
  onLoadUsers,
  onSetActiveUser,
  onUpdateUser,
} from "../../store/user/userSlice";
import { useAuthStore } from "../auth/useAuthStore";
import { useCalendarStore } from "../calendar/useCalendarStore";

/**
 * Custom hook for managing user-related operations in the application.
 *
 * Provides state and functions related to user management, such as loading,
 * saving, deleting users, and setting the active user. It interacts with
 * various APIs to perform operations and updates the Redux store accordingly.
 *
 * @returns An object containing:
 * - Properties:
 *   - `users`: List of users.
 *   - `activeUser`: The currently active user.
 *   - `hasUserSelected`: Boolean indicating if a user is selected.
 * - Methods:
 *   - `setActiveUser(user: User)`: Sets the specified user as active.
 *   - `startDeletingUser(user: User)`: Deletes the specified user.
 *   - `startLoadingUsers()`: Loads the list of users.
 *   - `startSavingPassword(user: User, password: string)`: Updates the user's password.
 *   - `startSavingUser(user: User)`: Saves a new or existing user.
 */
export const useUsersStore = () => {
  const dispatch = useAppDispatch();
  const { users, activeUser } = useSelector((state: any) => state.user);
  const { user: currentUser } = useSelector((state: any) => state.auth);
  const { startLogout } = useAuthStore();
  const { startDeletingUserEvents } = useCalendarStore();

  /**
   * Sets the specified user as active.
   *
   * @param {User} user - The user to be set as active.
   */
  const setActiveUser = (user: User) => {
    dispatch(onSetActiveUser(user));
  };

  /**
   * Saves a new or existing user.
   *
   * This function makes a POST or PUT request to the server to create or
   * update a user. If the request is successful, it dispatches the
   * onAddNewUser or onUpdateUser action with the new or updated user
   * information and reloads the list of users. If the request fails, it
   * shows an alert with the error message.
   *
   * @param {User} user - The user to be saved.
   */
  const startSavingUser = async (user: User) => {
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
        Alert.alert("Saved", "");
        startLoadingUsers();
        return;
      }
      // Create
      const { data } = await zephyrmApi.post("users/new", user);

      dispatch(onAddNewUser({ ...user, uid: data.uid }));
      Alert.alert("Created successfully", "");
      startLoadingUsers();
    } catch (error: any) {
      error.response.data?.msg &&
        Alert.alert("Error saving", error.response.data?.msg);
    }

    startLoadingUsers();
  };

  /**
   * Loads the list of users from the server.
   *
   * This function makes a GET request to the server to fetch the list of
   * users. If the request is successful, it dispatches the onLoadUsers action
   * with the received list of users and updates the application's state.
   * If an error occurs during the request, it logs the error to the console.
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
   * Deletes a user and all their events from the server.
   *
   * This function first deletes all events of the user by calling
   * startDeletingUserEvents, then makes a DELETE request to the server to
   * delete the user. If the request is successful, it dispatches the
   * onDeleteUser action to update the application's state. If the user being
   * deleted is the current user, it also logs out the user. If an error
   * occurs during the request, it displays an error alert.
   *
   * @param {User} user - The user to be deleted.
   */
  const startDeletingUser = async (user: User) => {
    if (!user) return;
    try {
      startDeletingUserEvents(user.uid);
      await zephyrmApi.delete(`users/${user.uid}`);
      dispatch(onDeleteUser());
      Alert.alert("Deleted successfully", "");
      startLoadingUsers();
      if (currentUser.uid === user.uid) startLogout();
    } catch (error: any) {
      Alert.alert("Error deleting", error.response.data.msg);
    }
  };

  /**
   * Updates a user's password in the server.
   *
   * Makes a PUT request to the server to update the user's password. If the
   * request is successful, it dispatches the onUpdateUser action with the
   * updated user information and shows an alert with a message saying that
   * the password was recovered successfully. It also reloads the users list.
   * If an error occurs during the request, it logs the error to the console
   * and shows an alert with the error message.
   *
   * @param {User} user - The user whose password is being updated.
   * @param {string} password - The new password.
   */
  const startSavingPassword = async (user: User, password: string) => {
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
      Alert.alert("Recover successfully", "");
      startLoadingUsers();
      return;
    } catch (error: any) {
      console.log({ error });
      Alert.alert("Error saving", error.response.data.errors.password?.msg);
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
