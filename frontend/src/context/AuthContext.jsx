import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("authUser");
    }
  }, [user]);

  const getErrorMessage = (error, fallback) => {
    return (
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      fallback
    );
  };

  const register = async (email, fullName, password, role) => {
    try {
      await api.post("/auth/register", {
        name: fullName,
        email,
        password,
        role,
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
    try {
      const response = await api.post("/auth/login", {
        email,
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
        email: email.toLowerCase().trim(),
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
