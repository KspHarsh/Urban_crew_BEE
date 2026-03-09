import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header>
      <div className="nav">
        <Link to="/" className="logo">
          <div className="logo-mark">UC</div>
          <div>
            <div>UrbanCrew</div>
            <small style={{ color: 'var(--muted)', fontWeight: 500 }}>Smart Workforce Services</small>
          </div>
        </Link>
        <nav>
          <ul>
            <li>
              <a href="/#services">Services</a>
            </li>
            <li>
              <a href="/#clients">Client Solutions</a>
            </li>
            <li>
              <a href="/#workers">For Workers</a>
            </li>
            <li>
              <a href="/#why">Why UrbanCrew</a>
            </li>
            <li>
              <a href="/#contact">Contact</a>
            </li>
          </ul>
        </nav>

        {currentUser ? (
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/dashboard" className="btn secondary">
              <i className="fa-solid fa-gauge" /> Dashboard
            </Link>
            <button onClick={handleLogout} className="btn" style={{ padding: '10px 20px' }}>
              <i className="fa-solid fa-right-from-bracket" /> Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link to="/login" className="btn secondary">
              <i className="fa-solid fa-right-to-bracket" /> Login
            </Link>
            <Link to="/register" className="btn">
              <i className="fa-solid fa-user-plus" /> Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
