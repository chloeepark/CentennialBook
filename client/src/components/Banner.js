import React from "react";
import { Link } from "react-router-dom";
import "./Banner.css";

function Banner({ isAuthenticated }) {
  console.log("isAuthenticated in Banner:", isAuthenticated);
  return (
    <nav className="banner">
      <Link to="/" className="logo">
        CentennialBook
      </Link>
      {isAuthenticated && (
        <div className="nav-links">
          <Link to="/events">Events</Link>
          <Link to="/clubs">Clubs</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/rsvp">RSVP</Link>
          <Link to="/CreatePost">Posts</Link>
          <Link to="/login">Logout</Link>
        </div>
      )}
    </nav>
  );
}

export default Banner;
