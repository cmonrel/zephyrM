/**
 * Modules Router Component
 *
 * This component defines the routes and navigation for the application modules.
 *
 * @module modules/router/ModulesRouter
 */

import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { CalendarPage, useCalendarStore } from "../calendar";
import { NavBar } from "../../components";
import { useAuthStore } from "../../auth";
import { UserManagementPage } from "../users/pages/UsersManagementPage";
import { AssetsPage } from "../assetsModule/pages/AssetsPage";
import { getEnvVariables } from "../../helpers/getEnvVariables";
import { useSocket } from "../../hooks";
import { RequestsAdminPage } from "../requests/pages/RequestsPage";
import { RequestsWorkerPage } from "../requests/pages/RequestsWorkerPage";
import { AssetsPageWorkers, useAssetsStore } from "../assetsModule";
import { useRequestsStore } from "../requests/hooks/useRequestsStore";
import { useUsersStore } from "../users/hooks/useUsersStore";

const { VITE_WEBSOCKET_URL } = getEnvVariables();

/**
 * This component defines the routes and navigation for the application modules.
 * It uses the `useAuthStore`, `useAssetsStore`, `useCalendarStore`, `useRequestsStore` and
 * `useUsersStore` hooks to load the necessary data before rendering the routes.
 * It also uses the `useSocket` hook to connect to the websocket server.
 * The component renders a `NavBar` component and a `Routes` component with
 * the following routes:
 * - For admin users:
 *   - /assets: AssetsPage
 *   - /calendar: CalendarPage
 *   - /requests: RequestsAdminPage
 *   - /: UserManagementPage
 *   - /*: Redirects to /
 * - For worker users:
 *   - /calendar: CalendarPage
 *   - /requests: RequestsWorkerPage
 *   - /assets: AssetsPageWorkers
 *   - /: Redirects to /requests
 */
export const ModulesRouter = () => {
  const { user, checkAuthToken, startLoadingNotifications } = useAuthStore();
  const { startLoadingAssets } = useAssetsStore();
  const { startLoadingRequests } = useRequestsStore();
  const { startLoadingEvents } = useCalendarStore();
  const { startLoadingUsers } = useUsersStore();
  useSocket(user.uid, VITE_WEBSOCKET_URL);

  /**
   * Effect hook to load data before rendering the routes.
   */
  useEffect(() => {
    const token = checkAuthToken();
    if (token) {
      startLoadingAssets();
      startLoadingEvents();
      startLoadingNotifications();
      startLoadingRequests();
      startLoadingUsers();
    }
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
            <Route path="/requests" element={<RequestsAdminPage />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/requests" element={<RequestsWorkerPage />} />
            <Route path="/assets" element={<AssetsPageWorkers />} />
            <Route path="/*" element={<Navigate to="/requests" />} />
          </>
        )}
      </Routes>
    </>
  );
};
