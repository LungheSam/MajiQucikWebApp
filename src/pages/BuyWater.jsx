import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import "../styles/BuyWater.css";

function BuyWater() {
  const [jerrycans, setJerrycans] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user details from the "users" collection
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        alert('❌ User data not found in Firestore.');
      }
    };

    fetchUserData();
  }, []);

  const handlePurchase = async () => {
    const parsedJerrycans = parseInt(jerrycans);
    if (!parsedJerrycans || parsedJerrycans < 1) {
      return alert('🚫 Please enter a valid number of jerrycans.');
    }

    const cost = parsedJerrycans * 100;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setLoading(true);

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      if (!userData) return alert('User data not found');

      const res = await fetch('https://majiquickserver.onrender.com/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: auth.currentUser.uid,
          name: userData.name,
          phone: userData.phone,
          email: userData.email,
          jerrycans: parsedJerrycans,
          cost,
          code,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setConfirmation(`💧 Purchase Successful!\n\n📦 Jerrycans: ${parsedJerrycans}\n🔐 Code: ${code}\n💰 Total Cost: ${cost} UGX\n\nThank you for choosing MajiQuick!`);
        setJerrycans('');
      } else {
        alert('❌ Failed to complete purchase');
      }

    } catch (error) {
      console.error(error);
      alert('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buywater-container">
      {/* Water drops animation */}
      <div className="water-drops">
        <div className="water-drop"></div>
        <div className="water-drop"></div>
        <div className="water-drop"></div>
        <div className="water-drop"></div>
        <div className="water-drop"></div>
      </div>

      <Header title={"Buy Water"} />
      
      <h2>Time to Buy Water</h2>
      
      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="number"
            placeholder="Enter number of jerrycans"
            value={jerrycans}
            onChange={(e) => setJerrycans(e.target.value)}
            min="1"
            max="100"
          />
        </div>
      </div>

      <div className="price-display">
        <p>Each JerryCan costs <strong>100 UGX</strong></p>
      </div>

      <button 
        onClick={handlePurchase} 
        className="buy-button" 
        disabled={loading || !jerrycans}
      >
        {loading ? 'Processing...' : '💳 Buy Water'}
      </button>

      {confirmation && (
        <div className="confirmation-box">
          <pre>{confirmation}</pre>
        </div>
      )}
    </div>
  );
}

export default BuyWater;
