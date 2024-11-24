import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Auth.css"

function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                setErrorMessage("Passwords do not match");
                return;
            }
            await axios.post(`http://localhost:5001/resetPassword/${token}`, { password });
            setErrorMessage("");
            navigate("/login");
        } catch (error) {
            setErrorMessage(error.response.data.message || "An error occured. Please try again.");
        }
    };

    return (
        <div>
            <div className="auth-container">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>Change Password</h2>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter new Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Repeat Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit">Save Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;