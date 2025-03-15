"use client";
import { Outlet, Link } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react';
import styles from './Layout.module.css';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import WebApp from '@twa-dev/sdk';

interface UserData {
  telegramId: number;
  createdAt: string;
  accessUntil: string;
  // ... other fields as needed
}

function Layout() {
  const [tonConnectUI] = useTonConnectUI();
  //@ts-ignore
  const [isConnected, setIsConnected] = useState(false);
    //@ts-ignore
  const [userData, setUserData] = useState<UserData | null>(null);
  const [accessAllowed, setAccessAllowed] = useState(false);
  const { t } = useTranslation();
  const telegramId = WebApp?.initDataUnsafe?.user?.id;
  useEffect(() => {
    if (tonConnectUI.wallet?.account?.address) {
      setIsConnected(true);
      // Fetch user data using telegramId
     
      if (telegramId) {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/telegram/${telegramId}`)
          .then(res => res.json())
          .then((data: UserData) => {
            setUserData(data);
            const accessUntilDate = new Date(data.accessUntil);
            const now = new Date();
            console.log("Now:", now, "AccessUntil:", accessUntilDate);
            if (new Date() < accessUntilDate) {
              setAccessAllowed(true);
            } else {
              setAccessAllowed(false);
            }
          })
          .catch(err => console.error("Error fetching user data:", err));
      }
    } else {
      setIsConnected(false);
      setAccessAllowed(false);
    }
    
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      setIsConnected(!!wallet?.account?.address);
    });
    
    return () => unsubscribe();
  }, [tonConnectUI,telegramId]);

  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>TON Connect</Link>
        {accessAllowed ? (
          <>
            <Link to="/quiz" className={styles.navLink}>{t('quiz')}</Link>
            <Link to="/profile" className={styles.navLink}>{t('profile')}</Link>
          </>
        ) : (
          <>
            <span className={styles.navLinkDisabled}>{t('quiz')}</span>
            <span className={styles.navLinkDisabled}>{t('profile')}</span>
          </>
        )}
        <div style={{ position: 'fixed', bottom: 0, right: 0, background: '#fff', padding: '0.5rem', zIndex: 9999 }}>
  Telegram ID: {WebApp.initDataUnsafe?.user?.id || 'нет данных'}
</div>
         <LanguageSwitcher />
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
