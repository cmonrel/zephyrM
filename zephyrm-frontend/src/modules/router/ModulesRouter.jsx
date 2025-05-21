import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { CalendarPage } from "../calendar";
import { NavBar } from "../../components";
import { useAuthStore } from "../../auth";
import { UserManagementPage } from "../users/pages/UsersManagementPage";
import { AssetsPage } from "../assetsModule/pages/AssetsPage";
import { getEnvVariables } from "../../helpers/getEnvVariables";
import { useSocket } from "../../hooks";

const { VITE_WEBSOCKET_URL } = getEnvVariables();

export const ModulesRouter = () => {
  const { user, checkAuthToken } = useAuthStore();
  useSocket(user.uid, VITE_WEBSOCKET_URL);

  useEffect(() => {
    checkAuthToken();
  }, []);

  return (
    <>
      <NavBar />

      <Routes>
        {user.role === "admin" ? (
          <>
            <Route path="*" element={<UserManagementPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="*" element={<CalendarPage />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
};
