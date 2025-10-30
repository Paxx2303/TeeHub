<<<<<<< HEAD
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RoleGuard = ({ children, roles = [] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0) {
    const userRoles = Array.isArray(user?.roles) ? user.roles : [];
    const allowed = roles.some((r) => userRoles.includes(r));
    if (!allowed) return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleGuard;


=======
import { Navigate } from "react-router-dom";
import { getRole } from "../../utils/auth";

export default function RoleGuard({ children, allow = [] }) {
  const role = getRole(); // "ROLE_USER" | "ROLE_ADMIN" | null
  if (allow.length === 0) return children;
  if (!role || !allow.includes(role)) return <Navigate to="/403" replace />;
  return children;
}
>>>>>>> origin/tan
