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

function App() {
  // Depending if user is authenticated or not, will determine what links to show
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Banner isAuthenticated={isAuthenticated} />
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
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
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/forgotPassword" element = {<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
