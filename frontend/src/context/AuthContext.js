import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    userType: localStorage.getItem("userType") || null,
    userId: localStorage.getItem("userId") || null,
    loggedIn: localStorage.getItem("loggedIn") === "true", 
  });

  // Login function
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      if (data.status === "ok") {
        const { token, userType, userId } = data.data;
         console.log(data) 
        setAuth({ token, userType, userId, loggedIn: true }); 
        localStorage.setItem("token", token);
        localStorage.setItem("userType", userType);
        localStorage.setItem("userId", userId);
        localStorage.setItem("loggedIn", "true"); 

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
    setAuth({ token: null, userType: null, userId: null, loggedIn: false });
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");
    localStorage.removeItem("loggedIn"); 
    toast.info("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
