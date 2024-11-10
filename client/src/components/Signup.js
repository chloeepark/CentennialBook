import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import Banner from './Banner';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', { username, password });
      navigate('/login');
    } catch (error) {
      console.error('There was an error signing up!', error);
    }
  };

  return (
    <div>
      <Banner />
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Signup</h2>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Signup</button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  );
}

export default Signup;