// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
  restrictRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  restrictRoles = [],
}) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  //   Public route  No auth needed
  if (allowedRoles.length === 0 && restrictRoles.length === 0) {
    return children;
  }

  //   Logged out user  only allow public routes
  if (!token || !userRole) {
    // if the route is protected (either user or admin)
    if (allowedRoles.length > 0) return <Navigate to="/" replace />;
    return children;
  }

  //   Restrict roles from accessing certain routes
  if (restrictRoles.includes(userRole)) {
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  //   Not authorized for the current protected route
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  //   Otherwise allow
  return children;
};

export default ProtectedRoute;
