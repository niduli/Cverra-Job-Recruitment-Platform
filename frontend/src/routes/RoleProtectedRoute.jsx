import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role?.toLowerCase())) {
    // If not allowed, redirect to their correct dashboard
    const dashboardMap = {
      jobseeker: "/jobseeker/dashboard",
      employer: "/employer/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={dashboardMap[user.role?.toLowerCase()]} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
