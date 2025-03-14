import { Outlet, Link } from 'react-router-dom';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect, useState } from 'react';
import styles from './Layout.module.css';

function Layout() {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Проверяем наличие адреса кошелька
    setIsConnected(!!tonConnectUI.wallet?.account?.address);
  }, [tonConnectUI.wallet]);

  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.navLink}>TON Connect</Link>
        {isConnected ? (
          <>
            <Link to="/quiz" className={styles.navLink}>Quiz</Link>
            <Link to="/profile" className={styles.navLink}>Profile</Link>
          </>
        ) : (
          <>
            <span className={styles.navLinkDisabled}>Quiz</span>
            <span className={styles.navLinkDisabled}>Profile</span>
          </>
        )}
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
