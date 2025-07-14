import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, doc, orderBy, getDocs, getDoc } from 'firebase/firestore';
import Header from '../components/Header';
import "../styles/Notifications.css"
function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState(null);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userData?.phone) return;

      const q = query(
        collection(db, 'notifications'),
        where('phone', '==', userData.phone),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(data);
    };

    if (userData) {
      fetchNotifications();
    }
  }, [userData]);

  return (
    <div className="notifications-container">
      <Header title="Notifications" />
      <div className="notifications">
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="notification-card">
              <p>{notif.message}</p>
              <small>{new Date(notif.timestamp.seconds * 1000).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
