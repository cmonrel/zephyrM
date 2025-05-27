/**
 * App Router Component
 *
 * This component defines the routes and navigation for the application.
 *
 * @module router/AppRouter
 */

import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage, useAuthStore } from "../auth";
import { ModulesRouter } from "../modules/router/ModulesRouter";

/**
 * App Router Component
 *
 * This component defines the routes and navigation for the application.
 * It renders a login page if the user is not authenticated, otherwise it renders
 * the modules router which defines the routes and navigation for the application
 * modules.
 *
 * The component uses the `useAuthStore` hook to check the authentication token
 * and handles the following cases:
 * - If the user is not authenticated, it renders the login page.
 * - If the user is authenticated, it renders the modules router.
 * - If the authentication token is being checked, it renders a "Cargando..." message.
 *
 * @returns {JSX.Element} The rendered routes and navigation for the application.
 */
export const AppRouter = () => {
  const { checkAuthToken, status } = useAuthStore();

  /**
   * Effect hook to check the authentication token before rendering the routes.
   */
  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") {
    return <h3>Cargando...</h3>;
  }

  return (
    <Routes>
      {status === "not-authenticated" ? (
        <>
          <Route path="/" element={<LoginPage />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="*" element={<ModulesRouter />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};
