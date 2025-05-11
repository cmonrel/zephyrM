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

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startSearchingRole = async ({ email }) => {
    try {
      const { data } = await zephyrmApi.get("auth/role", { email });
      console.log(data);
      Swal.fire("User validated", "", "success");
    } catch (error) {
      Swal.fire("Error", error.response.data.msg, "error");
    }
  };

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
          counter: data.counter,
        })
      );

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

  const checkAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onLogout());

    try {
      const { data } = await zephyrmApi.get("auth/renew");
      localStorage.setItem("token", data.token);
      localStorage.setItem("token-init-date", new Date().getTime());

      dispatch(onLogin({ name: data.name, uid: data.uid }));
    } catch (error) {
      localStorage.clear();
      dispatch(onLogout());
      console.log(error);
    }
  };

  const startLogout = () => {
    // TODO: logs

    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  const startBlockingAccount = async ({ email }) => {
    dispatch(onChecking());
    try {
      const { data } = await zephyrmApi.post("/auth/block", {
        email,
      });

      dispatch(onLogin({ name: data.name, uid: data.uid }));

      return data.token;
    } catch (error) {
      dispatch(onLogout(error.response.data?.msg));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
    localStorage.clear();
    dispatch(onLogoutCalendar());
    dispatch(onLogout());
  };

  return {
    // Properties
    errorMessage,
    status,
    user,

    // Methods
    checkAuthToken,
    startBlockingAccount,
    startLogin,
    startLogout,
    startSearchingRole,
  };
};
