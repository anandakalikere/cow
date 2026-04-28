import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiUpload, FiImage, FiVideo, FiMapPin } from 'react-icons/fi';
import api from '../api';

export default function AddCow({ user }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cowName: '',
    breed: '',
    price: '',
    phone: '',
    age: '',
    milkProduction: '',
    latitude: '',
    longitude: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const breeds = ['Gir', 'Jersey', 'Sahiwal', 'Holstein Friesian', 'Red Sindhi', 'Ongole'];

  // Get current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(4),
            longitude: position.coords.longitude.toFixed(4),
          }));
          setStatus('Location captured!');
          setTimeout(() => setStatus(''), 2000);
        },
        (error) => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 5) {
      setErrorMessage('Maximum 5 images allowed');
      return;
    }

    setImages((prev) => [...prev, ...files]);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    
    setErrorMessage('');
  };

  const handleVideo = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        setErrorMessage('Video size must be less than 100MB');
        return;
      }
      setVideo(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviews([reader.result]);
      };
      reader.readAsDataURL(file);
      setErrorMessage('');
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreviews([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatus('');

    // Validation
    if (!formData.cowName || !formData.breed || !formData.price || !formData.phone) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (images.length === 0 && !video) {
      setErrorMessage('Please upload at least one image or video');
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setErrorMessage('Please provide location');
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      
      // Add form fields
      payload.append('cowName', formData.cowName);
      payload.append('breed', formData.breed);
      payload.append('price', formData.price);
      payload.append('phone', formData.phone);
      payload.append('age', formData.age || 0);
      payload.append('milkProduction', formData.milkProduction || 0);
      payload.append('latitude', formData.latitude);
      payload.append('longitude', formData.longitude);

      // Add images
      images.forEach((file) => {
        payload.append('image', file);
      });

      // Add video if present
      if (video) {
        payload.append('video', video);
      }

      const response = await api.post('/add-cow', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStatus('✅ Cow listed successfully!');
      
      // Reset form
      setFormData({
        cowName: '',
        breed: '',
        price: '',
        phone: '',
        age: '',
        milkProduction: '',
        latitude: '',
        longitude: '',
      });
      setImages([]);
      setImagePreviews([]);
      setVideo(null);
      setVideoPreviews([]);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.response?.data?.message || 'Failed to add cow. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 pb-24 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">List Your Cow</h1>
        <p className="text-sm text-gray-600">Fill in the details and upload images/videos</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status Messages */}
        {status && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-600 text-sm">
            {status}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Basic Info Section */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
          <h2 className="font-semibold text-gray-800 text-sm">Basic Information</h2>

          <input
            type="text"
            name="cowName"
            placeholder="Cow Name *"
            value={formData.cowName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <select
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">Select Breed *</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="age"
              placeholder="Age (years)"
              value={formData.age}
              onChange={handleChange}
              min="0"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="number"
              name="milkProduction"
              placeholder="Milk (L/day)"
              value={formData.milkProduction}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {/* Price & Contact Section */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
          <h2 className="font-semibold text-gray-800 text-sm">Price & Contact</h2>

          <input
            type="number"
            name="price"
            placeholder="Price (₹) *"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={handleChange}
            required
            pattern="[0-9]{10}"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">Location</h2>
            <button
              type="button"
              onClick={handleGetLocation}
              className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition"
            >
              <FiMapPin size={14} />
              Auto
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="latitude"
              placeholder="Latitude *"
              value={formData.latitude}
              onChange={handleChange}
              required
              step="0.0001"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude *"
              value={formData.longitude}
              onChange={handleChange}
              required
              step="0.0001"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
          <h2 className="font-semibold text-gray-800 text-sm">
            Media (Upload at least one image or video)
          </h2>

          {/* Images Section */}
          <div>
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-600 transition bg-gray-50">
              <div className="text-center">
                <FiImage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload images ({images.length}/5)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`preview-${index}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Section */}
          <div>
            <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-600 transition bg-gray-50">
              <div className="text-center">
                <FiVideo className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload video (optional)
                </p>
                <p className="text-xs text-gray-500 mt-1">Max 100MB</p>
              </div>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideo}
                className="hidden"
              />
            </label>

            {/* Video Preview */}
            {videoPreviews.length > 0 && (
              <div className="mt-3 relative group">
                <video
                  src={videoPreviews[0]}
                  className="w-full h-32 object-cover rounded-lg bg-black"
                  controls
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <FiX size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            <>
              <FiUpload size={18} />
              List This Cow
            </>
          )}
        </button>
      </form>
    </div>
  );
}
