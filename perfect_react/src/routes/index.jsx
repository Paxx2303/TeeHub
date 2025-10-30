<<<<<<< HEAD
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './routeConfig.jsx';
import PublicRoute from './PublicRoute.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import RoleGuard from './guards/RoleGuard.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      {routes.map((r) => {
        const key = r.path;
        const element = r.roles
          ? (
              <PrivateRoute>
                <RoleGuard roles={r.roles}>{r.element}</RoleGuard>
              </PrivateRoute>
            )
          : r.public
          ? (
              <PublicRoute>{r.element}</PublicRoute>
            )
          : (
              <PrivateRoute>{r.element}</PrivateRoute>
            );

        return <Route key={key} path={r.path} element={element} />;
      })}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;


=======
// src/routes/index.jsx
import { useRoutes } from "react-router-dom";
import routes from "./routeConfig";

export default function AppRoutes() {
  return useRoutes(routes);
}
>>>>>>> origin/tan
