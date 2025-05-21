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

export const useUsersStore = () => {
  const dispatch = useAppDispatch();
  const { users, activeUser } = useSelector((state: any) => state.user);
  const { user: currentUser } = useSelector((state: any) => state.auth);
  const { startLogout } = useAuthStore();
  const { startDeletingUserEvents } = useCalendarStore();

  const setActiveUser = (user: User) => {
    dispatch(onSetActiveUser(user));
  };

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

  const startLoadingUsers = async () => {
    try {
      const { data } = await zephyrmApi.get("users");
      dispatch(onLoadUsers(data.usersMapped));
    } catch (error) {
      console.log("Error loading users");
      console.log(error);
    }
  };

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
