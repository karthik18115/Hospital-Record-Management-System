import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('authToken');
  const rawUserRole = localStorage.getItem('userRole');

  // Process the role from localStorage to remove "ROLE_" prefix and convert to uppercase
  const processedUserRole = rawUserRole?.toUpperCase().startsWith('ROLE_')
    ? rawUserRole.substring(5).toUpperCase()
    : rawUserRole?.toUpperCase();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Ensure allowedRoles are also uppercase for consistent comparison
  const upperAllowedRoles = allowedRoles.map(role => role.toUpperCase());

  if (allowedRoles && !upperAllowedRoles.includes(processedUserRole)) {
    console.log(`[PrivateRoute] Role mismatch: processedUserRole "${processedUserRole}" not in allowedRoles [${upperAllowedRoles.join(', ')}]. Redirecting to /unauthorized`);
    // Redirect to unauthorized or home page if role doesn't match
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('[PrivateRoute] Access granted.');
  return children;
};

export default PrivateRoute; 