import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import api from '../utils/api.js';
import L from 'leaflet';
import CowLoader from '../components/CowLoader.jsx';
import CowCard from '../components/CowCard.jsx';
import { useToast } from '../state/ToastContext.jsx';

const cowIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function NearbyCowsPage() {
  const [position, setPosition] = useState(null);
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [radius, setRadius] = useState(10000);
  const { addToast } = useToast();

  const handleGeoError = (err) => {
    console.error('Location error:', err);
    if (err.code === 1) {
      addToast('Location permission denied. Please allow location access and retry.', 'error');
    } else if (err.code === 2) {
      addToast('Could not determine location. Please try again.', 'error');
    } else {
      addToast('Failed to get your location.', 'error');
    }
    setLoading(false);
  };

  const fetchNearbyCows = async (lat, lng, radiusMeters = 10000) => {
    if (!lat || !lng) return;
    setError('');
    setLoading(true);

    try {
      const res = await api.get('/nearby-cows', {
        params: { lat, lng, radius: radiusMeters },
      });

      // Ensure sort by distance from backend
      const sorted = res.data.sort((a, b) => (a.distance || a.distanceMeters || 0) - (b.distance || b.distanceMeters || 0));
      setCows(sorted);
    } catch (err) {
      console.error(err);
      addToast('Failed to load nearby cows. Please try again.', 'error');
      setCows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        fetchNearbyCows(latitude, longitude, radius);
      },
      handleGeoError,
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section className="page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Nearby Cows</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={handleFindNearby}
          >
            📍 Find Nearby Cows
          </button>
          <select
            className="px-3 py-2 border rounded-lg text-sm"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
          >
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={20000}>20 km</option>
          </select>
        </div>
      </div>

      {loading && <CowLoader />}

      {position && (
        <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-sm text-slate-700">Current coords: {position[0].toFixed(4)}, {position[1].toFixed(4)}</p>
          <p className="text-xs text-slate-500">Radius: {(radius / 1000).toFixed(0)} km</p>
        </div>
      )}

      {cows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cows.map((cow) => <CowCard key={cow._id} cow={cow} />)}
        </div>
      )}

      {!loading && !cows.length && !error && (
        <p className="text-slate-500">No nearby cows showing yet. Click "Find Nearby Cows" to start.</p>
      )}

      {position && (
        <div className="mt-6 h-72 rounded-xl overflow-hidden border border-slate-200">
          <MapContainer center={position} zoom={12} style={{ width: '100%', height: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={cowIcon}>
              <Popup>Your location</Popup>
            </Marker>
            {cows.map((c) => (
              <Marker key={c._id} position={[c.location.coordinates[1], c.location.coordinates[0]]} icon={cowIcon}>
                <Popup>
                  <strong>{c.cowName}</strong>
                  <br />📍 {(c.distance || c.distanceKm || 0).toFixed(1)} km
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </section>
  );
}

