import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fname: "",
    email: "",
    password: "",
    userType: "user",
  });

  const { login, register } = useAuth();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ fname: "", email: "", password: "", userType: "user" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      await register(
        formData.fname,
        formData.email,
        formData.password,
        formData.userType
      );
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <ToastContainer />
      <div
        className="card shadow-lg"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-header bg-primary text-white text-center">
          <h2>{isLogin ? "Login" : "Register"}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Full Name input for Register only */}
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label" htmlFor="fname">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="fname"
                  id="fname"
                  value={formData.fname}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Email input */}
            <div className="mb-3">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password input */}
            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* User Type selection for Register only */}
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label" htmlFor="userType">
                  User Type
                </label>
                <select
                  className="form-control"
                  name="userType"
                  id="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
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

        {/* Footer with Toggle between Login/Register */}
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
