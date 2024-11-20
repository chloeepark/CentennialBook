import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css"

function ForgotPassword () {
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response =  await axios.post("http://localhost:5000/forgotPassword", { username });
            setErrorMessage("");
            if(response.data.message === "Password Request Email Sent!") {
                alert(response.data.message);
            }
        } catch (error) {
            if(error.response && error.response.data)  {
                setErrorMessage(error.response.data.message || "An Error Occurred!");
            }
        }
    };

    return (
        <div>
          <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
              <h2>Reset Password</h2>
              {errorMessage && <p class="error">{errorMessage}</p>}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button type="submit">Send Email</button>
              <p>
                <Link to="/login">Back to Login</Link>
              </p>
              <p>
                <Link to="/signup">New User? Register Now</Link>
              </p>
            </form>
          </div>
        </div>
      );
};

export default ForgotPassword;