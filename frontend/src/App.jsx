import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BottomNavbar from './components/BottomNavbar';
import Home from './pages/Home';
import BuyCow from './pages/BuyCow';
import AddCow from './pages/AddCow';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import CowDetailsPage from './pages/CowDetailsPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-md w-full bg-white relative pb-20">
        {/* Main Content */}
        <main className="pt-2">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/buy" element={<BuyCow user={user} />} />
            <Route path="/sell" element={<AddCow user={user} />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
            <Route path="/chat" element={<Chat user={user} />} />
            <Route path="/cow/:id" element={<CowDetailsPage user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <BottomNavbar />
      </div>
    </div>
  );
}

