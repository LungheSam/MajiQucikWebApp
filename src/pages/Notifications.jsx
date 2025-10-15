// import React, { useEffect, useState } from 'react';
// import { db, auth } from '../firebase';
// import { collection, query, where, doc, orderBy, getDocs, getDoc } from 'firebase/firestore';
// import Header from '../components/Header';
// import "../styles/Notifications.css"
// function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const userDocRef = doc(db, 'users', user.uid);
//       const userSnap = await getDoc(userDocRef);

//       if (userSnap.exists()) {
//         setUserData(userSnap.data());
//       } else {
//         alert('❌ User data not found in Firestore.');
//       }
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       if (!userData?.phone) return;

//       const q = query(
//         collection(db, 'notifications'),
//         where('phone', '==', userData.phone),
//         orderBy('timestamp', 'desc')
//       );

//       const snapshot = await getDocs(q);
//       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setNotifications(data);
//     };

//     if (userData) {
//       fetchNotifications();
//     }
//   }, [userData]);

//   return (
//     <div className="notifications-container">
//       <Header title="Notifications" />
//       <div className="notifications">
//         {notifications.length === 0 ? (
//           <p>No notifications yet.</p>
//         ) : (
//           notifications.map((notif) => (
//             <div key={notif.id} className="notification-card">
//               <p>{notif.message}</p>
//               <small>{new Date(notif.timestamp.seconds * 1000).toLocaleString()}</small>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default Notifications;

import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, doc, orderBy, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import Header from '../components/Header';
import "../styles/Notifications.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

      setLoading(true);
      const q = query(
        collection(db, 'notifications'),
        where('phone', '==', userData.phone),
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        read: doc.data().read || false 
      }));
      setNotifications(data);
      setLoading(false);
    };

    if (userData) {
      fetchNotifications();
    }
  }, [userData]);

  const markAsRead = async (notificationId) => {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, { read: true });
    
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const getNotificationType = (message) => {
    if (message.includes('success') || message.includes('completed') || message.includes('confirmed')) 
      return 'success';
    if (message.includes('warning') || message.includes('pending') || message.includes('processing')) 
      return 'warning';
    if (message.includes('error') || message.includes('failed') || message.includes('rejected')) 
      return 'error';
    return 'info';
  };

  return (
    <div className="notifications-container">
      <Header title="Notifications" />
      
      <div className="notifications-header">
        <h1>Notifications</h1>
      </div>

      <div className="notifications">
        {loading ? (
          <div className="loading-notifications">
            <div className="notification-skeleton"></div>
            <div className="notification-skeleton"></div>
            <div className="notification-skeleton"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id} 
              className="notification-card"
              data-type={getNotificationType(notif.message)}
              data-read={notif.read}
              onClick={() => markAsRead(notif.id)}
            >
              <p>{notif.message}</p>
              <small>
                {new Date(notif.timestamp.seconds * 1000).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;
