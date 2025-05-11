import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { CalendarPage } from "../calendar";
import { NavBar } from "../../components";
import { useAuthStore } from "../../auth";
import { UserManagementPage } from "../users/pages/UsersManagementPage";
import { AssetsPage } from "../assetsModule/pages/AssetsPage";

export const ModulesRouter = () => {
  const { checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

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
