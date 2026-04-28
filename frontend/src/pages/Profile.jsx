import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiEdit2, FiUser, FiPhone, FiMail } from 'react-icons/fi';

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
    }
  };

  const handleSaveProfile = () => {
    // Update localStorage
    const updatedUser = { ...user, ...editData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);

    // In real app, would also update backend
  };

  if (!user) {
    return (
      <div className="px-4 py-6 flex flex-col items-center justify-center min-h-screen">
        <FiUser size={64} className="text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg mb-6">Please login to view your profile</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <FiUser size={32} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-green-100 text-sm">{user.email}</p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-white text-green-700 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <FiEdit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Edit Mode */}
      {isEditing && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
          <h2 className="font-semibold text-gray-800 text-sm">Edit Profile</h2>

          <input
            type="text"
            value={editData.name}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Full Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            type="email"
            value={editData.email}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="Email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            type="tel"
            value={editData.phone}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Phone Number"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSaveProfile}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Profile Info */}
      {!isEditing && (
        <div className="bg-white rounded-lg border border-gray-200 divide-y">
          <div className="p-4 flex items-center gap-3">
            <FiPhone className="text-green-600" size={20} />
            <div>
              <p className="text-xs text-gray-600">Phone</p>
              <p className="font-semibold text-gray-800">{user.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <FiMail className="text-blue-600" size={20} />
            <div>
              <p className="text-xs text-gray-600">Email</p>
              <p className="font-semibold text-gray-800">{user.email || 'Not provided'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Account Stats */}
      {!isEditing && (
        <div className="grid grid-cols-2 gap-3 bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">5</div>
            <p className="text-xs text-gray-600">Listed Cows</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-gray-600">Messages</p>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition"
      >
        <FiLogOut size={18} />
        Logout
      </button>

      {/* Support Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-700 mb-2">Need help?</p>
        <a href="tel:+919999999999" className="text-blue-600 font-semibold text-sm hover:underline">
          Contact Support
        </a>
      </div>
    </div>
  );
}
