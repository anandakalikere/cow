import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiFilter } from 'react-icons/fi';
import api from '../api';
import CowCard from '../components/CowCard.jsx';

export default function BuyCow({ user }) {
  const navigate = useNavigate();
  const [cows, setCows] = useState([]);
  const [displayCows, setDisplayCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [selectedRadius, setSelectedRadius] = useState(20);
  const [userLocation, setUserLocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const breeds = ['Gir', 'Jersey', 'Sahiwal', 'Holstein Friesian', 'Red Sindhi', 'Ongole'];
  const radiusOptions = [5, 10, 20, 50];

  useEffect(() => {
    fetchCows();
    getUserLocation();
  }, []);

  useEffect(() => {
    filterCows();
  }, [cows, searchTerm, selectedBreed, selectedRadius, userLocation]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  };

  const calculateDistance = (lat, lng) => {
    if (!userLocation) return null;

    const R = 6371; // Earth's radius in km
    const dLat = ((lat - userLocation.latitude) * Math.PI) / 180;
    const dLng = ((lng - userLocation.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.latitude * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchCows = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/cows');
      const cowsWithDistance = response.data.map((cow) => {
        if (userLocation) {
          const distance = calculateDistance(cow.latitude, cow.longitude);
          return { ...cow, distance: distance * 1000 }; // convert to meters
        }
        return cow;
      });
      setCows(cowsWithDistance);
    } catch (err) {
      console.error(err);
      setError('Failed to load cows');
    } finally {
      setLoading(false);
    }
  };

  const filterCows = () => {
    let filtered = cows;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (cow) =>
          cow.cowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cow.breed.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Breed filter
    if (selectedBreed) {
      filtered = filtered.filter(
        (cow) =>
          (cow.aiBreedPrediction?.breed || cow.breed) === selectedBreed
      );
    }

    // Radius filter
    if (userLocation) {
      filtered = filtered.filter((cow) => {
        const distance = cow.distance || 0;
        return distance <= selectedRadius * 1000;
      });
    }

    setDisplayCows(filtered);
  };

  const handleNearby = () => {
    if (!userLocation) {
      alert('Please enable location to use nearby feature');
      return;
    }
    setSelectedRadius(5);
  };

  const handleCowSelect = (cowId) => {
    navigate(`/cow/${cowId}`);
  };

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Browse Cows</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or breed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      {/* Filter & Nearby Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex-1"
        >
          <FiFilter size={18} />
          Filters
        </button>
        <button
          onClick={handleNearby}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition flex-1"
        >
          <FiMapPin size={18} />
          Nearby
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
          {/* Breed Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Breed
            </label>
            <select
              value={selectedBreed}
              onChange={(e) => setSelectedBreed(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">All Breeds</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          {/* Radius Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Distance: {selectedRadius} km
            </label>
            <div className="space-y-2">
              {radiusOptions.map((radius) => (
                <button
                  key={radius}
                  onClick={() => setSelectedRadius(radius)}
                  className={`w-full py-2 rounded-lg font-semibold transition ${
                    selectedRadius === radius
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {radius} km
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-xl h-64 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
          {error}
        </div>
      ) : displayCows.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Found {displayCows.length} cow{displayCows.length !== 1 ? 's' : ''}
          </p>
          {displayCows.map((cow) => (
            <CowCard
              key={cow._id}
              cow={cow}
              onSelect={handleCowSelect}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600 text-sm mb-3">No cows found matching your criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedBreed('');
              setSelectedRadius(20);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
