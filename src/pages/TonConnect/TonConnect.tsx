// src/pages/TonConnect/TonConnectPage.tsx
"use client";
import { useEffect, useState } from "react";
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import { useLocation } from "react-router-dom";
import styles from "./TonConnect.module.css";
import WebApp from "@twa-dev/sdk";

function TonConnectPage() {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  const [referrerCode, setReferrerCode] = useState<string | null>(null);

  useEffect(() => {
    // Извлекаем параметр ref из URL, если он есть
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setReferrerCode(ref);
      console.log("Referral code detected:", ref);
    }
  }, [location]);

  useEffect(() => {
    console.log("TonConnect UI initialized", tonConnectUI);
    
    // Если кошелек уже подключен при монтировании
    if (tonConnectUI.wallet) {
      console.log("Wallet detected on mount:", tonConnectUI.wallet);
      handleAfterConnect();
    }

    // Подписка на изменения статуса кошелька
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      console.log("Wallet status changed:", wallet);
      if (wallet) {
        handleAfterConnect();
      } else {
        setIsConnected(false);
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI]);

  const handleAfterConnect = async () => {
    const walletAddress = tonConnectUI.wallet?.account.address;
    const telegramId = WebApp.initDataUnsafe?.user?.id || '12345';
    const telegramName = WebApp.initDataUnsafe?.user?.first_name || 'local';

    console.log("Attempting authentication with:", { walletAddress, telegramId, telegramName, referrerCode });

    if (!walletAddress || !telegramId) {
      console.error("Wallet or Telegram data is missing.");
      return;
    }

    try {
      // В теле запроса добавляем referrerCode, если он есть
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          telegramId,
          telegramName,
          referrerCode,  // может быть null, сервер обработает
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Server response:", data);
      setIsConnected(true);
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

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

          {isConnected && (
            <div className={styles.successMessage}>Wallet connected successfully!</div>
          )}

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
