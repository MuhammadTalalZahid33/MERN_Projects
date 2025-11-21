// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Very small protection wrapper:
 * Currently checks presence of token in localStorage.
 * Later you will replace this with AuthContext checks.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // not logged in -> redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
