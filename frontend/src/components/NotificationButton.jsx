import { useState, useEffect } from 'react';
import { requestPermission } from '../utils/firebase.js';
import api from '../utils/api.js';

export default function NotificationButton() {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const handleEnableNotifications = async () => {
    const token = await requestPermission();
    if (token) {
      // Send token to backend to store in user profile
      try {
        await api.post('/update-fcm-token', { fcmToken: token });
        alert('Notifications enabled!');
      } catch (error) {
        console.error('Error updating FCM token:', error);
        alert('Failed to enable notifications.');
      }
    } else {
      alert('Notification permission denied.');
    }
    setPermission(Notification.permission);
  };

  if (permission === 'granted') return null;

  return (
    <button
      onClick={handleEnableNotifications}
      className="fixed bottom-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition"
    >
      🔔 Enable Notifications
    </button>
  );
}