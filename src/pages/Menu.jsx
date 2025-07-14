// src/pages/Menu.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Header from '../components/Header';
import "../styles/Home.css";
function Menu() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="menu-page">
      <Header title="Menu" />

      <div className="menu-links">
        <Link to="/buy">💳 Buy Water</Link>
        <Link to="/notifications">🔔 Notifications</Link>
        <Link to="/profile">👤 Profile</Link>
        <button onClick={handleLogout} className='logout-button'> Logout </button>
      </div>
    </div>
  );
}

export default Menu;
