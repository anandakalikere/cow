import { useState } from 'react';

export default function CowGallery({ cow, onClose }) {
  const images = cow.images?.length ? cow.images : cow.imageURL ? [cow.imageURL] : [];
  const [index, setIndex] = useState(0);
  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900 text-2xl">×</button>
        </div>

        {images.length > 0 ? (
          <>
            <div className="relative">
              <img src={images[index]} alt={`cow ${index + 1}`} className="w-full h-[360px] md:h-[420px] object-cover rounded-xl" />
              <button onClick={prev} className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white text-slate-700">◀</button>
              <button onClick={next} className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow hover:bg-white text-slate-700">▶</button>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {images.map((src, i) => (
                <img key={`${src}-${i}`} src={src} alt={`thumb ${i + 1}`} onClick={() => setIndex(i)} className={`h-20 object-cover rounded-lg cursor-pointer ${i === index ? 'ring-2 ring-green-500' : 'ring-1 ring-slate-200'} hover:opacity-80`} />
              ))}
            </div>
          </>
        ) : (
          <p className="p-8 text-center text-slate-700">No images available</p>
        )}

        {cow.videoURL && (
          <div className="mt-4">
            <video controls className="w-full rounded-xl">
              <source src={cow.videoURL} type="video/mp4" />
            </video>
          </div>
        )}

        <div className="mt-4 text-sm text-slate-700">
          <p><span className="font-semibold">Breed:</span> {cow.aiBreedPrediction?.breed || 'N/A'} ({cow.aiBreedPrediction?.confidence || 0}%)</p>
          <p><span className="font-semibold">Health:</span> {cow.aiHealthStatus?.status || 'N/A'} ({cow.aiHealthStatus?.confidence || 0}%)</p>
        </div>
      </div>
    </div>
  );
}
