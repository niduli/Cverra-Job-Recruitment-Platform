import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= LOGIN FUNCTION =================
  const handleLogin = async () => {
    // validation
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      // login (context) - now returns result object
      const result = await login(email, password, role);

      if (!result.success) {
        // Show error message
        setError(result.error);

        // If there's a correct role, auto-select it
        if (result.correctRole) {
          setRole(result.correctRole);
        }
        return;
      }

      // Login successful - role based redirect
      const dashboardRoutes = {
        jobseeker: "/jobseeker/dashboard",
        employer: "/employer/dashboard",
        admin: "/admin/dashboard",
      };

      navigate(dashboardRoutes[result.user.role]);
    } finally {
      setLoading(false);
    }
  };

  // ENTER KEY LOGIN
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // ================= UI =================
  return (
    <div className="login-container">
      <div className="login-card">

        {/* HEADER */}
        <div className="login-header">
          <h1>Cverra</h1>
          <p>Click • Connect • Conquer</p>
        </div>

        <div className="login-content">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>

          {error && <div className="error-message">{error}</div>}

          {/* EMAIL */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              className="form-input"
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyPress}
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              className="form-input"
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyPress}
            />
          </div>

          {/* ROLE */}
          <div className="form-group">
            <label>I am a</label>
            <select
              value={role}
              className="form-select"
              onChange={(e) => {
                setRole(e.target.value);
                setError(""); // Clear error when role changes
              }}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* BUTTON */}
          <button onClick={handleLogin} className="login-button" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* FOOTER */}
          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="register-link">
                Create one
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
