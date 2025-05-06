import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { platformData } from '../data/platformData';
import '../styles/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const platforms = [
    { name: 'amazon', img: '/amazon/amazon.jpg' },
    { name: 'temu', img: '/temu/temu.jpg' },
    { name: 'aliexpress', img: '/aliexpress/aliexpress.jpg' },
    { name: 'etsy', img: '/etsy/etsy.jpg' },
  ];

  const filteredProducts = platforms.flatMap((platform) =>
    platformData[platform.name].links.filter((item) =>
      item.text.toLowerCase().includes(query.toLowerCase()) || item.id.includes(query)
    )
  );

  return (
    <div className="home-container">
      <h1>Welcome to Hamster Shop</h1>
      <p className="subtitle">Choose a platform to explore cool hamster stuff 🐹</p>

      <input
        type="text"
        placeholder="Search all items..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {query ? (
        // Если есть запрос, отображаем отфильтрованные продукты
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, i) => (
              <a key={i} href={item.href} target="_blank" rel="noreferrer" className="product-card">
                <img src={item.imgSrc} alt={item.text} />
                <span>{item.text}</span>
              </a>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      ) : (
        // Если запроса нет, отображаем платформы
        <div className="platform-grid">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="platform-btn"
              onClick={() => navigate(`/platform/${p.name}`)}
            >
              <img src={p.img} alt={p.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
