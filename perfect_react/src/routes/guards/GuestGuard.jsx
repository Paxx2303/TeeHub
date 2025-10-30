<<<<<<< HEAD
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const GuestGuard = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return children;
};

export default GuestGuard;


=======
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

export default function GuestGuard({ children }) {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
}
>>>>>>> origin/tan
