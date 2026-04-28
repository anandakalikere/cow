import { useEffect, useState } from 'react';
import api from '../utils/api.js';

export default function NearbyAlerts() {
  const [previousCount, setPreviousCount] = useState(0);

  useEffect(() => {
    const checkNearbyCows = async () => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await api.get('/nearby-cows', {
              params: { lat: latitude, lng: longitude, radius: 5000 },
            });
            const currentCount = res.data.length;

            if (currentCount > previousCount) {
              // New cows found
              showNotification(`🐄 New cows available near you! Found ${currentCount} cows within 5km.`);
            }
            setPreviousCount(currentCount);
          } catch (error) {
            console.error('Error checking nearby cows:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    };

    // Check immediately and then every 30 seconds
    checkNearbyCows();
    const interval = setInterval(checkNearbyCows, 30000);

    return () => clearInterval(interval);
  }, [previousCount]);

  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('Cow Marketplace', { body: message, icon: '/icon-192x192.png' });
    } else {
      // Fallback: show toast or alert
      alert(message);
    }
  };

  return null; // This component doesn't render anything
}