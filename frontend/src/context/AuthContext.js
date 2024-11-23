import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider: Wraps the app and provides auth-related data & functions
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    userType: localStorage.getItem("userType") || null,
  });

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (data.status === "ok") {
        setAuth({
          token: data.data.token,
          userType: data.data.userType,
        });

        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userType", data.data.userType);
        toast.success("Login successful!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Invalid credentials. Try again!"
      );
    }
  };

  // Register function
  const register = async (fname, email, password, userType) => {
    try {
      const { data } = await axios.post("http://localhost:5000/register", {
        fname,
        email,
        password,
        userType,
      });

      if (data.status === "ok") {
        toast.success("Registration successful! You can now log in.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Registration failed. Try again!"
      );
    }
  };

  // Logout function
  const logout = () => {
    setAuth({
      token: null,
      userType: null,
    });

    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    toast.info("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
