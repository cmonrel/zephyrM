import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { LoginPage, useAuthStore } from "../auth";
import { ModulesRouter } from "../modules/router/ModulesRouter";

export const AppRouter = () => {
  const { checkAuthToken, status } = useAuthStore();
  // const authStatus = "not-authenticated";

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
