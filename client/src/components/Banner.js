import React from "react";
import "./Banner.css";

function Banner({ isAuthenticated }) {
  return (
    <div className="banner">
      <h1>CentennialBook</h1>
      {isAuthenticated && (
        <ul className="user-links">
          <li>
            <a href="/profile">Profile</a>
          </li>
        </ul>
      )}
    </div>
  );
}

export default Banner;
