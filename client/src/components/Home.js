import React from "react";
import { useNavigate } from "react-router-dom";

function Home({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div>
      <div className="home-container">
        <h2>Home</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default Home;
