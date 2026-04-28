import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api.js";

export default function BuyCowsPage() {
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    breed: "",
    minPrice: "",
    maxPrice: ""
  });

  const fetchCows = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (filters.breed) params.breed = filters.breed;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      const res = await api.get("/cows", { params });
      setCows(res.data);
    } catch (err) {
      setError("Failed to load cows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const onFilterSubmit = (e) => {
    e.preventDefault();
    fetchCows();
  };

  return (
    <div>
      <h2>Buy Cows</h2>
      <form className="filter-row" onSubmit={onFilterSubmit}>
        <input
          name="breed"
          placeholder="Filter by breed"
          value={filters.breed}
          onChange={onFilterChange}
        />
        <input
          name="minPrice"
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={onFilterChange}
        />
        <input
          name="maxPrice"
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={onFilterChange}
        />
        <button type="submit">Apply</button>
      </form>

      {loading && <p>Loading cows...</p>}
      {error && <div className="error">{error}</div>}
      <div className="grid">
        {cows.map((cow) => (
          <Link key={cow._id} to={`/cow/${cow._id}`} className="cow-card">
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
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

