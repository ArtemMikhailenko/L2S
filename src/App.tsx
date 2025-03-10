import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import './App.css';

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Функция-обработчик, которую мы хотим передать в onClick
    const handleMainButtonClick = () => {
      WebApp.showAlert('Действие выполнено!');
      WebApp.sendData(JSON.stringify({
        action: 'submit',
        data: { /* ваши данные */ }
      }));
    };

    // Инициализация Telegram WebApp
    WebApp.ready();
    document.body.style.backgroundColor = WebApp.backgroundColor;

    if (WebApp.initDataUnsafe?.user) {
      setUser(WebApp.initDataUnsafe.user);
    }

    WebApp.expand();
    WebApp.MainButton.setText('Подтвердить');

    // Передаём колбэк
    WebApp.MainButton.onClick(handleMainButtonClick);

    return () => {
      // Снимаем тот же колбэк
      WebApp.MainButton.offClick(handleMainButtonClick);
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
