import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  //state for error handling
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/signup", { username, password });
      setErrorMessage("");
      navigate("/login");
    } catch (error) {
      //if any errors on server side, display
      if(error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "An error occured.");
      }
      console.error("There was an error signing up!", error);
    }
  };

  return (
    <div>
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Signup</h2>
          {errorMessage && <p className="error">{errorMessage}</p>}
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
          <button type="submit">Signup</button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
