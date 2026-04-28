import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Smart Cow Marketplace</h1>
        <p>
          Buy and sell cows with AI-powered breed and health detection, plus smart nearby
          search.
        </p>
        <div className="hero-actions">
          <Link to="/buy" className="btn primary">
            Browse Cows
          </Link>
          <Link to="/sell" className="btn">
            Sell a Cow
          </Link>
        </div>
      </div>
    </section>
  );
}

