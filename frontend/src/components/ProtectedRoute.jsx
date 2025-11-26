import React, { useContext } from "react";
import { AppContext } from "../context/globalContext.jsx";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  // Get the token and loading state from global context
  const { token, loading } = useContext(AppContext);

  // React Router hook to know the current URL
  const location = useLocation();

  // 1. While context is still checking token (e.g., checking localStorage)
  //    we wait. Otherwise user will be redirected too early.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">Loading secure session...</p>
      </div>
    );
  }

  // 2. If the user is NOT logged in (no token)
  //    Redirect to login page.
  //    Pass "state" so after login they return to this page automatically.
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. If token exists → user is authenticated → show requested page
  return children;
};

ProtectedRoute.propTypes = {
  // Component(s) to render when the route is allowed
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
