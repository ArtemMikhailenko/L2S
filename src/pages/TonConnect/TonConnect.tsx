// src/pages/TonConnect.tsx
import { TonConnectButton } from '@tonconnect/ui-react';
import styles from './TonConnect.module.css';

function TonConnectPage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.quizElements}>
        <div className={styles.quizElement}></div>
        <div className={styles.quizElement}></div>
        <div className={styles.quizElement}></div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.glowEffect}></div>
        <div className={styles.quizGraphic}>?</div>
        
        <div className={styles.content}>
          <div className={styles.logoArea}>
            <span className={styles.logoIcon}>🧠</span>
            <h1 className={styles.title}>TON Quiz</h1>
          </div>
          
          <h2 className={styles.subtitle}>Connect Your Wallet</h2>
          
          <div className={styles.infoBox}>
            <p className={styles.description}>
              Connect your TON wallet to start the game, answer questions, and win crypto prizes.
            </p>
          </div>
          
          <div className={styles.walletArea}>
            <TonConnectButton className={styles.connectButton} />
            <div className={styles.walletNote}>Supported: Tonkeeper, TonHub, and others</div>
          </div>
          
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🎮</div>
              <div className={styles.featureText}>Play</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🏆</div>
              <div className={styles.featureText}>Win</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💎</div>
              <div className={styles.featureText}>Earn Prizes</div>
            </div>
          </div>
          
          <div className={styles.quizSample}>
            <div className={styles.sampleQuestion}>Ready to test your knowledge?</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TonConnectPage;
