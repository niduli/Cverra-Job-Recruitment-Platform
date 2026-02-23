import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";

const PublicRoute = () => {
  const { user } = useAuth();

  // If user is logged in, redirect to their dashboard
  if (user) {
    const dashboardMap = {
      jobseeker: "/jobseeker/dashboard",
      employer: "/employer/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={dashboardMap[user.role?.toLowerCase()]} replace />;
  }

  // Otherwise show login page
  return <Login />;
};

export default PublicRoute;
