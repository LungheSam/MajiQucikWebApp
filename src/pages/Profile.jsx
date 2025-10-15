import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Header from '../components/Header';
import '../styles/Profile.css';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [userStats, setUserStats] = useState({ purchases: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
          
          // Fetch user purchase stats
          const purchasesQuery = query(
            collection(db, 'purchases'),
            where('uid', '==', user.uid)
          );
          const purchasesSnap = await getDocs(purchasesQuery);
          const purchases = purchasesSnap.docs.map(doc => doc.data());
          
          const totalSpent = purchases.reduce((sum, purchase) => sum + (purchase.cost || 0), 0);
          setUserStats({
            purchases: purchases.length,
            totalSpent: totalSpent
          });
        } else {
          alert('❌ Could not find user data.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('❌ Error loading profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = () => {
    // Implement edit profile functionality
    alert('Edit profile feature coming soon!');
  };

  const handleChangePassword = () => {
    // Implement change password functionality
    alert('Change password feature coming soon!');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Header title="Profile" />
        <div className="loading-profile">
          <div className="loading-avatar"></div>
          <div className="loading-text"></div>
          <div className="loading-text" style={{width: '150px'}}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Water drops animation */}
      <div className="water-drops">
        <div className="water-drop"></div>
        <div className="water-drop"></div>
        <div className="water-drop"></div>
        <div className="water-drop"></div>
        <div className="water-drop"></div>
      </div>

      <Header title="Profile" />
      
      <div className="profile-content">
        {userData ? (
          <>
            {/* Profile Header */}
            <div className="profile-header">
              <div className="profile-avatar"></div>
              <h1 className="profile-name">{userData.name}</h1>
              <p className="profile-welcome">Welcome to your MajiQuick profile</p>
            </div>

            {/* Profile Information */}
            <div className="profile-info">
              <div className="info-card">
                <div className="info-header">
                  <div className="info-icon"></div>
                  <h3 className="info-label">Email Address</h3>
                </div>
                <p className="info-value">{userData.email}</p>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <div className="info-icon"></div>
                  <h3 className="info-label">Phone Number</h3>
                </div>
                <p className="info-value">{userData.phone}</p>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <div className="info-icon"></div>
                  <h3 className="info-label">User ID</h3>
                </div>
                <p className="info-value">{auth.currentUser?.uid.slice(0, 8)}...</p>
              </div>
            </div>

            {/* User Stats */}
            <div className="profile-stats">
              <div className="stat-card">
                <p className="stat-number">{userStats.purchases}</p>
                <p className="stat-label">Total Purchases</p>
              </div>
              <div className="stat-card">
                <p className="stat-number">{userStats.totalSpent} UGX</p>
                <p className="stat-label">Total Spent</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              <button className="action-button" onClick={handleEditProfile}>
                ✏️ Edit Profile
              </button>
              <button className="action-button primary" onClick={handleChangePassword}>
                🔒 Change Password
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <p>Unable to load profile data</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;