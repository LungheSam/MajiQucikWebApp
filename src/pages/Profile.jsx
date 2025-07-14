// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import '../styles/Profile.css';

function Profile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        alert('❌ Could not find user data.');
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="profile-container">
      <Header title="Profile" />
      <div className="profile-content">
        {userData ? (
          <>
            <h2>{userData.name}</h2>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone}</p>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
