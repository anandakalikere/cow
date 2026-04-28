import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import api from '../api';
import CowCard from '../components/CowCard';

export default function Home({ user }) {
  const [nearbyCows, setNearbyCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNearbyCows();
  }, []);

  const fetchNearbyCows = async () => {
    try {
      setLoading(true);
      // Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await api.get('/cows', {
              params: { latitude, longitude, radius: 20000 }, // 20km radius
            });
            setNearbyCows(response.data.slice(0, 3)); // Show top 3
          },
          () => {
            // Fallback if geolocation fails
            fetchAllCows();
          }
        );
      } else {
        fetchAllCows();
      }
    } catch (error) {
      console.error('Error fetching nearby cows:', error);
      setError('Failed to load cows');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCows = async () => {
    try {
      const response = await api.get('/cows');
      setNearbyCows(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching cows:', error);
      setError('Failed to load cows');
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to MooMarket</h1>
        <p className="text-green-50 text-sm mb-4">Your trusted livestock marketplace with AI</p>
        <p className="text-green-100 text-xs">
          {user ? `Hello, ${user.name}!` : 'Sign in to get started'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/buy"
          className="bg-blue-600 text-white rounded-xl p-4 text-center font-semibold hover:bg-blue-700 transition shadow-md"
        >
          <div className="text-2xl mb-2">🛒</div>
          Buy Cow
        </Link>
        <Link
          to="/sell"
          className="bg-green-600 text-white rounded-xl p-4 text-center font-semibold hover:bg-green-700 transition shadow-md"
        >
          <div className="text-2xl mb-2">📤</div>
          Sell Cow
        </Link>
      </div>

      {/* Nearby Cows Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiMapPin className="text-red-600" />
            Nearby Cows
          </h2>
          <Link to="/buy" className="text-green-600 text-sm font-semibold hover:underline">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
            {error}
          </div>
        ) : nearbyCows.length > 0 ? (
          <div className="space-y-4">
            {nearbyCows.map((cow) => (
              <CowCard key={cow._id} cow={cow} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-600 text-sm">No cows available nearby. Try selling one!</p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{nearbyCows.length}</div>
          <p className="text-xs text-gray-600">Available</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">24h</div>
          <p className="text-xs text-gray-600">Fast Deals</p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">100%</div>
          <p className="text-xs text-gray-600">Verified</p>
        </div>
      </div>
    </div>
  );
}
