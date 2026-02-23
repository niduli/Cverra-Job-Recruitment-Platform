import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    // Load registered users from localStorage
    const saved = localStorage.getItem("registeredUsers");
    return saved ? JSON.parse(saved) : {};
  });

  // Save registered users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // REGISTER USER
  const register = (email, fullName, password, role) => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user already exists
    if (registeredUsers[normalizedEmail]) {
      return { success: false, error: "Email already registered" };
    }

    // Store user with their role
    const newUser = {
      email: normalizedEmail,
      fullName,
      password, // NOTE: In production, this should be hashed!
      role: role.toLowerCase().trim(),
    };

    setRegisteredUsers((prev) => ({
      ...prev,
      [normalizedEmail]: newUser,
    }));

    return { success: true };
  };

  // LOGIN USER
  const login = (email, role) => {
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedRole = role.toLowerCase().trim();

    // Check if user exists
    const registeredUser = registeredUsers[normalizedEmail];
    if (!registeredUser) {
      return { success: false, error: "User not found. Please register first." };
    }

    // Check if role matches
    if (registeredUser.role !== normalizedRole) {
      return {
        success: false,
        error: `This email is registered as ${registeredUser.role}. Please select the correct role.`,
        correctRole: registeredUser.role,
      };
    }

    // Login successful
    const fakeUser = {
      email: normalizedEmail,
      fullName: registeredUser.fullName,
      role: normalizedRole,
    };

    setUser(fakeUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
