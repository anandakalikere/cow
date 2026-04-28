import { useEffect, useState } from "react";
import api from "../utils/api.js";

export default function MyListingsPage() {
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/my-cows");
      setCows(res.data);
    } catch (err) {
      setError("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteCow = async (id) => {
    try {
      await api.delete(`/cow/${id}`);
      setConfirmId(null);
      load();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2>My Listings</h2>
      {loading && <p>Loading...</p>}
      {error && <div className="error">{error}</div>}
      <div className="grid">
        {cows.map((cow) => (
          <div key={cow._id} className="cow-card">
            <img src={cow.imageURL} alt={cow.cowName} />
            <div className="cow-info">
              <h3>{cow.cowName}</h3>
              <p>
                <strong>Breed:</strong> {cow.breed}
              </p>
              {cow.aiBreedPrediction && (
                <p>
                  <strong>AI Breed:</strong> {cow.aiBreedPrediction}
                </p>
              )}
              {cow.healthStatus && (
                <p>
                  <strong>Health:</strong> {cow.healthStatus}
                </p>
              )}
              <p>
                <strong>Price:</strong> ₹{cow.price}
              </p>
              <div className="actions">
                {/* For brevity, only delete; edit could be added similarly */}
                <button onClick={() => setConfirmId(cow._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {confirmId && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Are you sure you want to delete this listing?</p>
            <div className="modal-actions">
              <button onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="danger" onClick={() => deleteCow(confirmId)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

