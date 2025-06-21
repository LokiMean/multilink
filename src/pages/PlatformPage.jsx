import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/PlatformPage.css';

export default function PlatformPage() {
  const { platformName } = useParams(); // Имя платформы из URL
  const navigate = useNavigate();
  const location = useLocation(); // Для доступа к state, переданному из HomePage

  const [query, setQuery] = useState('');
  const [currentPlatform, setCurrentPlatform] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null); // Сбрасываем ошибку при изменении platformName или location.state
    // setCurrentPlatform(null); // Можно сбросить здесь, чтобы избежать показа старых данных на мгновение

    // Для отладки можно добавить логи:
    // console.log("PlatformPage useEffect triggered. platformName:", platformName, "location.state:", location.state);

    if (location.state && location.state.platform) {
      const receivedPlatform = location.state.platform;
      // Проверяем, соответствует ли имя платформы в state имени в URL
      if (receivedPlatform.name === platformName) {
        setCurrentPlatform(receivedPlatform);
      } else {
        // Несоответствие: возможно, устаревшие данные в state или изменен URL вручную
        setError(`Данные для платформы '${receivedPlatform.name}' были переданы, но URL указывает на '${platformName}'. Пожалуйста, вернитесь на главную страницу.`);
        setCurrentPlatform(null); // Очищаем, чтобы не показывать неверные данные
      }
    } else {
      // Данные о платформе не были переданы через state.
      // Это может произойти, если пользователь перешел по прямой ссылке.
      setError(`Данные для платформы '${platformName}' не доступны. Пожалуйста, перейдите с главной страницы.`);
      setCurrentPlatform(null);
    }
    setLoading(false);
  }, [platformName, location.state]); // Зависимости useEffect

  if (loading) {
    return <div className="platform-container"><p>Загрузка данных платформы...</p></div>;
  }

  if (error) {
    return (
      <div className="platform-container error-container">
        <p>Ошибка: {error}</p>
        <button className="back-btn" onClick={() => navigate('/')}>На главную</button>
      </div>
    );
  }

  if (!currentPlatform) {
    // Эта ситуация должна быть в основном покрыта состоянием error,
    // но является дополнительной защитой.
    return (
      <div className="platform-container">
        <p>Платформа '{platformName}' не найдена или данные не загружены.</p>
        <button className="back-btn" onClick={() => navigate('/')}>На главную</button>
      </div>
    );
  }

  // Убедимся, что currentPlatform.links это массив, прежде чем фильтровать
  const linksToFilter = Array.isArray(currentPlatform.links) ? currentPlatform.links : [];

  const filteredLinks = linksToFilter.filter(link =>
    link.name.toLowerCase().includes(query.toLowerCase()) ||
    String(link.id).toLowerCase().includes(query.toLowerCase()) // ID ссылки (приводим к строке)
  );

  return (
    <div className="platform-container">
      <button className="back-btn" onClick={() => navigate(-1)}>←</button>
      <h1>{currentPlatform.name}</h1> {/* Используем имя из currentPlatform */}
      <p className="platform-subtitle">Explore the cutest and most useful hamster products!</p>

      <input
        type="text"
        placeholder={`Поиск по товарам в ${currentPlatform.name}...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />

      {linksToFilter.length === 0 ? (
        <p>Для этой платформы пока нет доступных товаров.</p>
      ) : (
        <div className="product-grid">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link) => ( // link - это объект ссылки из currentPlatform.links
              <a
                key={link.id} // Используем ID ссылки как ключ
                href={link.link} // Используем link.link для href
                target="_blank"
                rel="noreferrer"
                className="product-card"
              >
                {/* Используем link.image_url напрямую (предполагается абсолютный URL) */}
                <img src={link.image_url} alt={link.name} />
                <span>{link.name}</span> {/* Используем link.name для текста */}
              </a>
            ))
          ) : (
            <p>Товары по запросу "{query}" в категории {currentPlatform.name} не найдены.</p>
          )}
        </div>
      )}
    </div>
  );
}
