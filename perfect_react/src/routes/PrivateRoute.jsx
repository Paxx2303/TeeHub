import React from 'react';
import AuthGuard from './guards/AuthGuard';

const PrivateRoute = ({ children }) => {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
};

export default PrivateRoute;


