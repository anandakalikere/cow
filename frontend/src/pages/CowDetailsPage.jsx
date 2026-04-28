import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiPhone,
  FiMessageCircle,
  FiMapPin,
  FiShare2,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
} from 'react-icons/fi';
import api from '../api';

export default function CowDetailsPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cow, setCow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchCowDetails();
  }, [id]);

  const fetchCowDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/cow/${id}`);
      setCow(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load cow details');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${cow?.phone}`;
  };

  const handleWhatsApp = () => {
    const phoneNumber = cow?.phone?.replace(/[^\d]/g, '');
    window.location.href = `https://wa.me/91${phoneNumber}?text=Hi, I'm interested in your cow ${cow?.cowName}`;
  };

  const handleChat = () => {
    navigate('/chat');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: cow?.cowName,
        text: `Check out ${cow?.cowName} - ${cow?.breed} at ₹${cow?.price}`,
        url: window.location.href,
      });
    } else {
      alert('Share: ' + window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !cow) {
    return (
      <div className="px-4 py-6 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-600 font-semibold mb-4"
        >
          <FiArrowLeft /> Go Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error || 'Cow not found'}
        </div>
      </div>
    );
  }

  const images = cow.images || [];
  const currentImage = images[currentImageIndex] || 'https://via.placeholder.com/500x500?text=Cow';

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="font-semibold text-gray-800 flex-1 text-center">Cow Details</h1>
        <button
          onClick={handleShare}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <FiShare2 size={24} />
        </button>
      </div>

      {/* Image Gallery */}
      <div className="relative bg-gray-100">
        <div className="relative w-full h-80 bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={currentImage}
            alt={`${cow.cowName} ${currentImageIndex}`}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/500x500?text=Cow')}
          />

          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <FiChevronLeft size={20} />
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
              >
                <FiChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1}/{images.length}
          </div>

          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-3 left-3 bg-white rounded-full p-2 hover:bg-gray-100 transition"
          >
            <FiHeart
              size={24}
              className={isFavorite ? 'fill-red-600 text-red-600' : 'text-gray-600'}
            />
          </button>
        </div>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto bg-white border-b border-gray-200">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                  index === currentImageIndex
                    ? 'border-green-600'
                    : 'border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`thumbnail-${index}`}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/50x50?text=Cow')}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="px-4 py-4 space-y-6">
        {/* Basic Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{cow.cowName}</h1>
              <p className="text-gray-600 text-sm mt-1">
                Listed by <span className="font-semibold">{cow.ownerName || 'Farmer'}</span>
              </p>
            </div>
            <button className="text-yellow-500 hover:scale-110 transition">💛</button>
          </div>
          <p className="text-4xl font-bold text-green-600 mt-3">₹{cow.price?.toLocaleString()}</p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <FiCheck size={16} />
            {cow.aiBreedPrediction?.breed || cow.breed || 'Unknown'}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <FiCheck size={16} />
            {cow.aiHealthStatus?.status || 'Not Assessed'}
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
            Age: {cow.age} years
          </div>
        </div>

        {/* Key Details */}
        <div className="bg-white rounded-lg border border-gray-200 divide-y">
          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-600 text-sm">Breed</span>
            <span className="font-semibold text-gray-800">
              {cow.aiBreedPrediction?.breed || cow.breed}
            </span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-600 text-sm">Age</span>
            <span className="font-semibold text-gray-800">{cow.age} years</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-600 text-sm">Daily Milk Production</span>
            <span className="font-semibold text-gray-800">{cow.milkProduction}L</span>
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-gray-600 text-sm">Health Status</span>
            <span
              className={`font-semibold ${
                cow.aiHealthStatus?.status === 'Healthy'
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {cow.aiHealthStatus?.status || 'Not Assessed'}
            </span>
          </div>
        </div>

        {/* AI Predictions */}
        {(cow.aiBreedPrediction?.confidence ||
          cow.aiHealthStatus?.confidence) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">AI Analysis</h3>
            {cow.aiBreedPrediction?.confidence && (
              <p className="text-sm text-blue-800">
                🧬 Breed confidence: {(cow.aiBreedPrediction.confidence * 100).toFixed(1)}%
              </p>
            )}
            {cow.aiHealthStatus?.confidence && (
              <p className="text-sm text-blue-800">
                💚 Health confidence: {(cow.aiHealthStatus.confidence * 100).toFixed(1)}%
              </p>
            )}
          </div>
        )}

        {/* Location */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3">
          <FiMapPin className="text-red-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-gray-600 text-sm font-semibold">Location</p>
            <p className="text-gray-800 text-sm">
              Coordinates: {cow.latitude?.toFixed(4)}, {cow.longitude?.toFixed(4)}
            </p>
            <a
              href={`https://maps.google.com/?q=${cow.latitude},${cow.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 text-sm font-semibold hover:underline mt-1"
            >
              View on Map →
            </a>
          </div>
        </div>

        {/* Description if available */}
        {cow.description && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{cow.description}</p>
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto">
        <div className="flex gap-2">
          <button
            onClick={handleCall}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
          >
            <FiPhone size={20} />
            Call
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
          >
            <FiMessageCircle size={20} />
            WhatsApp
          </button>
          <button
            onClick={handleChat}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition"
          >
            <FiMessageCircle size={20} />
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}

