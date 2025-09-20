import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const currentUser = useSelector((state) => state.users.currentUser);

  // 🔐 If user not logged in → redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children; // ✅ Allow access
}

export default PrivateRoute;
