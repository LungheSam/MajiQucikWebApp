import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import "../styles/BuyWater.css";

function BuyWater() {
  const [jerrycans, setJerrycans] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [userData, setUserData] = useState(null);

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

        try {
          // Step 1: Fetch user details (from local data or Firestore)
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          if (!userData) return alert('User data not found');

          // Step 2: Send purchase info to backend
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
            setConfirmation(`✅ You bought ${parsedJerrycans} jerrycans.\n💧 Code: ${code}\n💰 Cost: ${cost} UGX`);
            setJerrycans('');
          } else {
            alert('❌ Failed to complete purchase');
          }

        } catch (error) {
          console.error(error);
          alert('❌ Something went wrong.');
        }
  };


  return (
    <div className="buywater-container">
      <Header title={"Buy Water"} />
      <h2>Time to Buy Water</h2>
      <input
        type="number"
        placeholder="Enter number of jerrycans"
        value={jerrycans}
        onChange={(e) => setJerrycans(e.target.value)}
      />
      <p>Each JerryCan costs <strong>100 UGX</strong></p>
      <button onClick={handlePurchase} className='buy-button'>Buy</button>
      
      {confirmation && (
        <div className="confirmation-box">
          <pre>{confirmation}</pre>
        </div>
      )}
    </div>
  );
}

export default BuyWater;
