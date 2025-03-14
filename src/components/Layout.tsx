import { Outlet, Link } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react';
import styles from './Layout.module.css';
import LanguageSwitcher from './LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

function Layout() {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnected, setIsConnected] = useState(false);
  const { t } = useTranslation();

  // При изменении статуса кошелька обновляем состояние
  useEffect(() => {
    // Если кошелек уже подключен при монтировании
    if (tonConnectUI.wallet?.account?.address) {
      setIsConnected(true);
    }
    
    // Подписываемся на изменения статуса кошелька
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      setIsConnected(!!wallet?.account?.address);
    });
    
    return () => unsubscribe();
  }, [tonConnectUI]);

  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>TON Connect</Link>
        {isConnected ? (
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
         <LanguageSwitcher />
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
