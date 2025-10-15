// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

function Home() {
  return (
    <div className="home">
      <Header title="MajiQuick" />

      <main className="home-main">
        <h2>Welcome to MajiQuick</h2>
        <p className='home-main-desc'>
          MajiQuick makes it easy to buy water from your phone. You can pay online using this application or dial <strong>*384*87564#</strong> to purchase via USSD.
        </p>
        <Link to="/buy">
          <button className="big-buy-button">💳 Buy Water</button>
        </Link>
      </main>
    </div>
  );
}

export default Home;
