import { useState } from 'react';
import './General.css';

const plants = {
  "Картошка": "url('./potato.jpg')",
    "Помидоры": "url('./tomato.jpg')",
    "Морковь": "url('./carrot.png')",
};

const Header = ({ username, onChangeUsername, onAvatarChange }) => (
  <header>
{/* Раздел меню с кнопками для навигации */}
    <div id="menu">
      <button>Растения</button>
      <button>Грядки</button>
      <button>Полив</button>
      <button>Удобрения</button>
    </div>
     {/* Профиль пользователя с аватаром и именем */}
    <div id="user-profile">
      <label htmlFor="avatar-input" id="avatar-label">
        <img id="avatar" src="default-avatar.png" alt="Аватар" />
      </label>
      <input
        type="file"
        id="avatar-input"
        accept="image/*"
        onChange={onAvatarChange} // Обработчик изменения аватара
      />
      <span id="username" onClick={onChangeUsername}>{username}</span>
    </div>
  </header>
);

const PlotManager = ({ plots, currentPlot, onSelectPlot, onCreatePlot }) => (
  <footer>
    <div id="plots-container">
      <div id="plots-footer-container">
        {Object.keys(plots).map((plotName) => (
          <div
            key={plotName}
            className={`plot ${currentPlot === plotName ? 'selected' : ''}`}
            onClick={() => onSelectPlot(plotName)}
          >
            {plotName}
          </div>
        ))}
      </div>
      <div id="create-plot-frame" onClick={onCreatePlot}>
        <span>+</span>
        <p>Создать участок</p>
      </div>
    </div>
  </footer>
);

const PlantModal = ({ isOpen, onClose, onConfirm }) => {
  const [plantType, setPlantType] = useState('');
  const [bedCount, setBedCount] = useState(1);

  const handleSubmit = () => {
    onConfirm(plantType, bedCount); // Подтверждение выбора
    onClose(); // Закрытие модального окна
  };

  if (!isOpen) return null; // Условие рендера модального окна

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <h3>Выберите растение</h3>
        <label htmlFor="plant-select">Растение:</label>
        <select
          id="plant-select"
          value={plantType}
          onChange={(e) => setPlantType(e.target.value)} // Установка типа растения
        >
          {Object.keys(plants).map((plant) => (
            <option key={plant} value={plant}>{plant}</option>
          ))}
        </select>
        <label htmlFor="bed-count">Количество грядок:</label>
        <input
          type="number"
          id="bed-count"
          min="1"
          value={bedCount}
          onChange={(e) => setBedCount(parseInt(e.target.value, 10) || 1)} // Установка количества грядок
        />
        <button onClick={handleSubmit}>Посадить</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
};

const General = () => {
  const [username, setUsername] = useState('Имя пользователя');
  const [avatar, setAvatar] = useState('default-avatar.png');
  const [plots, setPlots] = useState({});
  const [currentPlot, setCurrentPlot] = useState(null);
  const [isPlantModalOpen, setPlantModalOpen] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = () => {
    const newName = prompt('Введите новое имя пользователя:');
    if (newName) setUsername(newName);
  };

  const handleSelectPlot = (plotName) => {
    setCurrentPlot(plotName);
  };

  const handleCreatePlot = () => {
    const plotName = prompt('Введите имя участка:');
    if (plotName && !plots[plotName]) {
      setPlots({ ...plots, [plotName]: {} });
    } else {
      alert('Некорректное имя или участок уже существует!');
    }
  };

  const handlePlantConfirm = (plantType, bedCount) => {
    if (currentPlot) {
      setPlots({
        ...plots,
        [currentPlot]: { plant: plantType, beds: bedCount },
      });
    }
  };

  return (
    <div>
      <Header
        username={username}
        onChangeUsername={handleUsernameChange}
        onAvatarChange={handleAvatarChange}
      />
      <main>
        <h2 id="plot-title">
          {currentPlot ? `Участок: ${currentPlot}` : 'Выберите участок'}
        </h2>
        <div id="plot-details">
          <p id="plant-info">
            {currentPlot && plots[currentPlot]?.plant
              ? `Растение: ${plots[currentPlot].plant}, Грядок: ${plots[currentPlot].beds}`
              : 'Нет данных'}
          </p>
          {currentPlot && plots[currentPlot]?.plant && (
            <div id="plant-image-container">
              <img
                src={plants[plots[currentPlot].plant]}
                alt={plots[currentPlot].plant}
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          )}
        </div>
        <button
          id="plant-button"
          disabled={!currentPlot}
          onClick={() => setPlantModalOpen(true)}
        >
          Посадить растение
        </button>
      </main>
      <PlotManager
        plots={plots}
        currentPlot={currentPlot}
        onSelectPlot={handleSelectPlot}
        onCreatePlot={handleCreatePlot}
      />
      <PlantModal
        isOpen={isPlantModalOpen}
        onClose={() => setPlantModalOpen(false)}
        onConfirm={handlePlantConfirm}
      />
    </div>
  );
};

export default General;
