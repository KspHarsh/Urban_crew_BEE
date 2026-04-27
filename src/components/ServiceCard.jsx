import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ServiceCard({ title, description, icon }) {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();

  const handleHireNow = () => {
    if (!currentUser) {
      // Not logged in — show toast and redirect to login
      toast.error('Please login or create an account first!');
      navigate('/login');
      return;
    }

    // Logged in — redirect to role-based dashboard
    switch (userRole) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'client':
        navigate('/client/dashboard');
        break;
      case 'worker':
        navigate('/worker/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="card">
      <div className="icon">
        <i className={`fa-solid ${icon}`} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button
        type="button"
        className="btn secondary"
        onClick={handleHireNow}
      >
        <i className="fa-solid fa-arrow-right"></i> Hire Now
      </button>
    </div>
  );
}
