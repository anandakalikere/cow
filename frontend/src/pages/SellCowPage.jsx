import { useState } from "react";
import api from "../utils/api.js";

export default function SellCowPage() {
  const [form, setForm] = useState({
    cowName: "",
    breed: "",
    age: "",
    milkProduction: "",
    price: "",
    latitude: "",
    longitude: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append("image", image);

      await api.post("/add-cow", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess("Cow listed successfully. AI predictions will appear on the listing.");
      setForm({
        cowName: "",
        breed: "",
        age: "",
        milkProduction: "",
        price: "",
        latitude: "",
        longitude: ""
      });
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to list cow");
    } finally {
      setLoading(false);
    }
  };

  const fillFromGeolocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6)
      }));
    });
  };

  return (
    <div className="card">
      <h2>Sell a Cow</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={onSubmit} className="grid-form">
        <input
          name="cowName"
          placeholder="Cow Name"
          value={form.cowName}
          onChange={onChange}
        />
        <input
          name="breed"
          placeholder="Breed (manual)"
          value={form.breed}
          onChange={onChange}
        />
        <input
          name="age"
          type="number"
          placeholder="Age (years)"
          value={form.age}
          onChange={onChange}
        />
        <input
          name="milkProduction"
          type="number"
          placeholder="Milk Production (L/day)"
          value={form.milkProduction}
          onChange={onChange}
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={onChange}
        />
        <div className="location-row">
          <input
            name="latitude"
            placeholder="Latitude"
            value={form.latitude}
            onChange={onChange}
          />
          <input
            name="longitude"
            placeholder="Longitude"
            value={form.longitude}
            onChange={onChange}
          />
          <button type="button" onClick={fillFromGeolocation}>
            Use My Location
          </button>
        </div>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Uploading & analyzing..." : "List Cow"}
        </button>
      </form>
    </div>
  );
}

