// src/pages/TonConnect.tsx
import { TonConnectButton } from '@tonconnect/ui-react';
import styles from './TonConnect.module.css';

function TonConnectPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Подключение кошелька TON</h2>
      {/*
        Готовая кнопка из @tonconnect/ui-react.
        По нажатию откроется диалог выбора кошелька.
      */}
      <TonConnectButton className={styles.connectButton} />
    </div>
  );
}

export default TonConnectPage;
