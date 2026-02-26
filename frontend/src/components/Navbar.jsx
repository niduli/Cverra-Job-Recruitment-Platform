import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user?.role) return "/";
    if (user.role === "employer") return "/employer/dashboard";
    if (user.role === "jobseeker") return "/jobseeker/dashboard";
    if (user.role === "admin") return "/admin/dashboard";
    return "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="Go to home">
          <img src="/logo.svg" alt="Cverra Logo" className="brand-logo" />
        </Link>

        <div className="navbar-content">
          {user ? (
            <div className="navbar-user">
              <div className="user-meta">
                <span className="user-role">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
                <span className="user-email">{user.email}</span>
              </div>

              <div className="navbar-actions">
                <Link to={getDashboardPath()} className="profile-link dashboard-link">
                  Dashboard
                </Link>
                <Link to="/profile" className="profile-link">
                  Profile
                </Link>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="navbar-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link register-link">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
