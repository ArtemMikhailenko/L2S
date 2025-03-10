// src/App.tsx
import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Инициализация Telegram WebApp
    WebApp.ready();
    
    // Установка темы
    document.body.style.backgroundColor = WebApp.backgroundColor;
    
    // Получение информации о пользователе
    if (WebApp.initDataUnsafe?.user) {
      setUser(WebApp.initDataUnsafe.user);
    }
    
    // Показать приложение на весь экран
    WebApp.expand();
    
    // Установка заголовка в Main Button (если нужно)
    WebApp.MainButton.setText('Подтвердить');
    
    // Обработчик нажатия на Main Button
    WebApp.MainButton.onClick(() => {
      // Здесь ваша логика при нажатии кнопки
      WebApp.showAlert('Действие выполнено!');
      
      // Пример отправки данных в Telegram бот
      WebApp.sendData(JSON.stringify({
        action: 'submit',
        data: { /* ваши данные */ }
      }));
    });
    
    return () => {
      // Очистка обработчиков
      WebApp.MainButton.offClick();
    };
  }, []);

  return (
    <div className="container">
      <header>
        <h1>Telegram Web App</h1>
      </header>
      
      <main>
        {user ? (
          <div className="user-info">
            <p>Привет, {user.first_name}!</p>
            <p>ID: {user.id}</p>
          </div>
        ) : (
          <p>Загрузка информации о пользователе...</p>
        )}
        
        <div className="content">
          {/* Контент вашего приложения */}
          <button 
            onClick={() => WebApp.MainButton.show()}
            className="app-button"
          >
            Показать основную кнопку
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;