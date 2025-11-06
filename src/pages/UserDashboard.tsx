import React from 'react';
import { Navigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  // Redirect users to the main property browser instead of showing a welcome page
  return <Navigate to="/" replace />;
};

export default UserDashboard;
