import { useEffect } from "react";
import { io } from "socket.io-client";
import { Navigate, Route, Routes } from "react-router-dom";

import { CalendarPage } from "../calendar";
import { NavBar } from "../../components";
import { useAuthStore } from "../../auth";
import { UserManagementPage } from "../users/pages/UsersManagementPage";
import { AssetsPage } from "../assetsModule/pages/AssetsPage";
import { getEnvVariables } from "../../helpers/getEnvVariables";

const { VITE_API_URL } = getEnvVariables();

const socket = io(VITE_API_URL);

export const ModulesRouter = () => {
  const { user, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  useEffect(() => {
    if (user.uid) {
      socket.emit("register", user.uid);
    }

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("notification", (data) => {
      alert(data.message);
    });

    return () => {
      socket.off("notification");
    };
  }, [user]);

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="*" element={<UserManagementPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};
