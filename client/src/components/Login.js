import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Login({ setIsAuthenticated }) {
  const [activeTab, setActiveTab] = useState("user"); // Track the active tab
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/login", {
        username,
        password,
      });

      if (response.data.message === "Login successful") {
        const token = response.data.token;
        const isAdmin = response.data.isAdmin;

        localStorage.setItem("token", token);
        localStorage.setItem("isAdmin", isAdmin);

        setIsAuthenticated(true);
        navigate("/home");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <div className="auth-container">
        {/* Tabs for User and Admin */}
        <div className="tabs">
          <button
            className={activeTab === "user" ? "active-tab" : ""}
            onClick={() => {
              setActiveTab("user");
              setErrorMessage("");
            }}
          >
            User Login
          </button>
          <button
            className={activeTab === "admin" ? "active-tab" : ""}
            onClick={() => {
              setActiveTab("admin");
              setErrorMessage("");
            }}
          >
            Admin Login
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{activeTab === "user" ? "User" : "Admin"}</h2>
          {errorMessage && <p className="auth-error">{errorMessage}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {activeTab === "user" ? "Login as User" : "Login as Admin"}
          </button>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p>
            Forgot password? <Link to="/forgotPassword">Reset Password</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
