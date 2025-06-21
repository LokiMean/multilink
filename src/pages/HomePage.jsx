import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchPlatforms } from '../api/platforms'; // Предполагаем, что эта функция теперь fetchPlatformData
import '../styles/HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [platformData, setPlatformData] = useState([]); // Инициализируем как пустой массив
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlatforms() // Используем fetchPlatformData
      .then(data => {
        if (Array.isArray(data)) {
          setPlatformData(data);
        } else {
          console.error("fetchPlatformData не вернул массив:", data);
          setError("Получен неверный формат данных для платформ.");
          setPlatformData([]); // Устанавливаем пустой массив для предотвращения ошибок
        }
      })
      .catch((err) => {
        console.error("Ошибка при загрузке данных платформ:", err);
        setError(err.message || "Не удалось загрузить данные платформ");
      })
      .finally(() => setLoading(false));
  }, []);

  // Платформы для отображения в сетке (когда нет поиска)
  // Используем platformData как массив
  const platformsToDisplay = platformData.map(platform => ({
    id: platform.id,
    name: platform.name,
    imageUrl: platform.image_url, // Используем image_url из данных API
  }));

  // Продукты, отфильтрованные по поисковому запросу
  // Используем platformData как массив
  const filteredProducts = query
    ? platformData.flatMap(platform => // platform - это объект из массива platformData
        (platform.links || []).filter(link => // link - это объект из platform.links
          link.name.toLowerCase().includes(query.toLowerCase()) ||
          String(link.id).toLowerCase().includes(query.toLowerCase()) // Сравниваем ID ссылки как строку
        )
      )
    : [];

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

      {loading ? (
        <p>Loading platforms...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : query ? ( // Если есть поисковый запрос, показываем отфильтрованные продукты
        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((link) => ( // link - это объект ссылки
              <a
                key={link.id} // Используем уникальный ID ссылки как ключ
                href={link.link} // Используем link.link для href
                target="_blank"
                rel="noreferrer"
                className="product-card"
              >
                {/* Используем link.image_url напрямую. Предполагается, что это абсолютный URL. */}
                <img src={link.image_url} alt={link.name} />
                <span>{link.name}</span> {/* Используем link.name для текста */}
              </a>
            ))
          ) : (
            <p>No products found matching "{query}"</p>
          )}
        </div>
      ) : ( // В противном случае показываем сетку платформ
      <div className="platform-grid">
        {platformsToDisplay.map((p_display) => {
          const fullPlatformObject = platformData.find(data => data.id === p_display.id);

          return (
            <div
              key={p_display.id}
              className="platform-btn"
              onClick={() => {
                if (fullPlatformObject) {
                  navigate(`/platform/${fullPlatformObject.name}`, { state: { platform: fullPlatformObject } });
                }
              }}
            >
              <img src={p_display.imageUrl} alt={p_display.name} />
              <div className="platform-name">{p_display.name}</div> {/* Показываем имя платформы */}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
