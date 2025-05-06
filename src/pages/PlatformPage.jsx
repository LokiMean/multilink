import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { platformData } from '../data/platformData';
import '../styles/PlatformPage.css';

export default function PlatformPage() {
  const { platformName } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const platform = platformData[platformName];

  if (!platform) return <div>Platform not found.</div>;

  const filtered = platform.links.filter((item) =>
    item.text.toLowerCase().includes(query.toLowerCase()) ||
    item.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="platform-container">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>
      <h1>{platform.title}</h1>
      <p className="platform-subtitle">Explore the cutest and most useful hamster products!</p>

      <input
        type="text"
        placeholder="Search items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      <div className="product-grid">
        {filtered.map((item) => (
          <a key={item.id} href={item.href} target="_blank" rel="noreferrer" className="product-card">
            <img src={`${import.meta.env.BASE_URL}${item.imgSrc}`} alt={item.text} />
            <span>{item.text}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
