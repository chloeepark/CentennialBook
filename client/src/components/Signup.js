import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Signup() {
  const [activeTab, setActiveTab] = useState("user"); // Track the active tab
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Determine the endpoint based on the active tab
      const endpoint =
        activeTab === "user"
          ? "http://localhost:5001/signup"
          : "http://localhost:5001/admin/signup";
      await axios.post(endpoint, { username, password });
      setErrorMessage("");
      alert(
        activeTab === "user"
          ? "User account created successfully!"
          : "Admin account created successfully!"
      );
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "An error occurred.");
      }
      console.error("There was an error signing up!", error);
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
            User Signup
          </button>
          <button
            className={activeTab === "admin" ? "active-tab" : ""}
            onClick={() => {
              setActiveTab("admin");
              setErrorMessage("");
            }}
          >
            Admin Signup
          </button>
        </div>

        {/* Form for Signup */}
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{activeTab === "user" ? "User" : "Admin"}</h2>
          {errorMessage && <p className="auth-error">{errorMessage}</p>}
          <input
            type="text"
            placeholder="Username (Email)"
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
            {activeTab === "user" ? "Signup as User" : "Signup as Admin"}
          </button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
