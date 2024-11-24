import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css"

function ForgotPassword () {
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [formInAction, setFormInAction] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(formInAction) { //if currently handling a request, stop them from submitting another one by spamming the submit button.
          setErrorMessage("Please wait.");
          return;
        }
        setFormInAction(true);
        try {
            const response =  await axios.post("http://localhost:5001/forgotPassword", { username });
            setErrorMessage("");
            if(response.data.message === "Password Request Email Sent!") {
                alert(response.data.message);
            }
        } catch (error) {
            if(error.response && error.response.data)  {
                setErrorMessage(error.response.data.message || "An Error Occurred!");
            }
        } finally {
          setFormInAction(false);
        }
    };

    return (
        <div>
          <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
              <h2>Reset Password</h2>
              {errorMessage && <p className="error">{errorMessage}</p>}
              {formInAction && <p>{"Please wait while we process.."}</p>}
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