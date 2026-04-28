import { FiPhone, FiMessageCircle, FiMapPin } from 'react-icons/fi';

export default function CowCard({ cow, onSelect }) {
  const thumbnail = cow.images?.[0] || cow.imageURL || 'https://via.placeholder.com/300x300?text=Cow';
  const distance = cow.distance ? (cow.distance / 1000).toFixed(2) : '0';
  const breed = cow.aiBreedPrediction?.breed || cow.breed || 'Unknown';
  const health = cow.aiHealthStatus?.status || cow.health || 'Not Assessed';
  const healthColor = health === 'Healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${cow.phone}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const phoneNumber = cow.phone ? cow.phone.replace(/[^\d]/g, '') : '0000000000';
    window.location.href = `https://wa.me/91${phoneNumber}?text=Hi, I'm interested in your cow ${cow.cowName}`;
  };

  return (
    <article
      onClick={() => onSelect && onSelect(cow._id)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      {/* Image with Distance Badge */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <img
          src={thumbnail}
          alt={cow.cowName}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = 'https://via.placeholder.com/300x300?text=Cow')}
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          <FiMapPin size={12} />
          {distance} km
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-lg mb-1">{cow.cowName}</h3>
        <p className="text-2xl font-bold text-green-600 mb-2">₹{cow.price?.toLocaleString()}</p>

        {/* Badges */}
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
            {breed}
          </span>
          <span className={`${healthColor} px-2 py-1 rounded-full text-xs font-semibold`}>
            {health}
          </span>
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
            Age: {cow.age}y
          </span>
        </div>

        {/* Details */}
        <p className="text-gray-600 text-sm mb-3">
          Milk: {cow.milkProduction}L/day | Owner: {cow.ownerName || 'N/A'}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCall}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition text-sm"
          >
            <FiPhone size={16} />
            Call
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition text-sm"
          >
            <FiMessageCircle size={16} />
            WhatsApp
          </button>
        </div>
      </div>
    </article>
  );
}
