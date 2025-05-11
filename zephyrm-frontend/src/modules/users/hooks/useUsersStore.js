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

export const useUsersStore = () => {
  const dispatch = useDispatch();
  const { users, activeUser } = useSelector((state) => state.user);

  const setActiveUser = (user) => {
    dispatch(onSetActiveUser(user));
  };

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

  const startLoadingUsers = async () => {
    try {
      const { data } = await zephyrmApi.get("users");
      dispatch(onLoadUsers(data.usersMapped));
    } catch (error) {
      console.log("Error loading users");
      console.log(error);
    }
  };

  const startDeletingUser = async (user) => {
    if (!user) return;
    try {
      await zephyrmApi.delete(`users/${user.uid}`);
      dispatch(onDeleteUser());
      Swal.fire("Deleted successfully", "", "success");
      startLoadingUsers();
    } catch (error) {
      Swal.fire("Error deleting", error.response.data.msg, "error");
    }
  };

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
