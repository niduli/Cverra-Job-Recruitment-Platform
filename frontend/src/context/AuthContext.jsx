import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("authUser");
    const token = localStorage.getItem("authToken");

    if (!savedUser || !token) return null;

    return JSON.parse(savedUser);
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  const getErrorMessage = (error, fallback) => {
    if (error?.code === "ERR_NETWORK") {
      return "Cannot reach backend API. Make sure backend is running on http://localhost:5000.";
    }

    return (
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      fallback
    );
  };

  const register = async (email, fullName, password, role) => {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRole = role?.toLowerCase().trim() || "jobseeker";

    try {
      await api.post("/auth/register", {
        name: fullName,
        email: normalizedEmail,
        password,
        role: normalizedRole,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Registration failed."),
      };
    }
  };

  const login = async (email, password, role) => {
    const normalizedEmail = email.toLowerCase().trim();

    try {
      const response = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      const responseUser = response.data?.user;
      const token = response.data?.token;

      if (!responseUser || !token) {
        return {
          success: false,
          error: "Invalid login response from server.",
        };
      }

      const backendRole = responseUser.role?.toLowerCase();
      const selectedRole = role?.toLowerCase();

      if (selectedRole && backendRole !== selectedRole) {
        return {
          success: false,
          error: `This account is registered as ${backendRole}. Please select the correct role.`,
          correctRole: backendRole,
        };
      }

      const normalizedUser = {
        id: responseUser.id,
        name: responseUser.name,
        email: normalizedEmail,
        role: backendRole,
      };

      localStorage.setItem("authToken", token);
      setUser(normalizedUser);

      return {
        success: true,
        user: normalizedUser,
      };
    } catch (error) {
      return {
        success: false,
        error: getErrorMessage(error, "Login failed."),
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
