<<<<<<< HEAD
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuthGuard = ({ children }) => {
  // const { isAuthenticated, isLoading } = useAuth();
  // const location = useLocation();

  // if (isLoading) return null;

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  return children;
};

export default AuthGuard;


=======
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

export default function AuthGuard({ children }) {
  const authed = isAuthenticated();
  const loc = useLocation();
  if (!authed) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}
>>>>>>> origin/tan
