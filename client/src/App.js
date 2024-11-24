import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Banner from "./components/Banner";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import EventFeed from "./components/EventFeed";
import ClubManagement from "./components/ClubManagement";
import PostList from "./components/PostList";
import CreatePost from "./components/CreatePost";
import RSVP from "./components/RSVP";
import Profile from "./components/Profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  return (
    <Router>
      <Banner isAuthenticated={isAuthenticated} userRole={userRole} />
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              setIsAuthenticated={setIsAuthenticated}
              setUserRole={setUserRole}
            />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <Home setIsAuthenticated={setIsAuthenticated} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/clubs"
          element={
            isAuthenticated ? <ClubManagement /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />

        <Route
          path="/events"
          element={isAuthenticated ? <EventFeed /> : <Navigate to="/login" />}
        />

        <Route path="/postList" element={<PostList />} />
        <Route path="/CreatePost" element={<CreatePost />} />
        <Route path="/rsvp" element={<RSVP />} />

        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
