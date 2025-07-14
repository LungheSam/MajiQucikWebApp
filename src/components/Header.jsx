// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Home.css";
function Header({ title }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1 className="app-title" onClick={()=>navigate("/")} >{title}</h1>
      <button className="menu-button" onClick={() => navigate('/menu')}>☰</button>
    </header>
  );
}

export default Header;
