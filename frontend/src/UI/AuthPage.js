import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fname: "",
    email: "",
    password: "",
    userType: "", 
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fname: "", email: "", password: "", userType: "user" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userType = localStorage.getItem("userType")
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
                if (userType === "admin") {
          navigate("/admin");
        } else if (userType === "user") {
          navigate("/user");
        } 
      } else {
        // Handle Registration
        await register(
          formData.fname,
          formData.email,
          formData.password,
          formData.userType
        );
        toast.success("Registration successful! Please login.");
        toggleMode();
      }
    } catch (error) {
      toast.error("Error: " + (error.message || "Failed to authenticate."));
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <ToastContainer />
      <div
        className="card shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-header bg-primary text-white text-center">
          <h2>{isLogin ? "Login" : "Register"}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label" style={{ display: "block" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="fname"
                  value={formData.fname}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  style={{ width: "95%", margin: "auto" }}
                />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label" style={{ display: "block" }}>
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                style={{ width: "95%", margin: "auto" }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" style={{ display: "block" }}>
                Password
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                style={{ width: "95%", margin: "auto" }}
              />
            </div>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label" style={{ display: "block" }}>
                  User Type
                </label>
                <select
                  className="form-control"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  style={{ width: "95%", margin: "auto" }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary mt-3"
                style={{ width: "70%" }}
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </div>
          </form>
        </div>
        <div className="card-footer text-center">
          <small className="text-muted">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              className="btn btn-link text-primary fw-bold p-0"
              onClick={toggleMode}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </small>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
