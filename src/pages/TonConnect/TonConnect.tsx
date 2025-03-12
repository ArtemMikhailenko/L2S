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
    // Extract referral code from various possible sources
    const extractReferralCode = () => {
      console.log("Extracting referral code...");
      console.log("WebApp data:", WebApp.initDataUnsafe);
      
      // Проверяем URL параметры
      const params = new URLSearchParams(location.search);
      const refFromUrl = params.get("ref");
      
      // Проверяем различные возможные источники параметра из Telegram
      const startParam = WebApp.initDataUnsafe?.start_param;
      
      // Проверяем строку initData напрямую (может содержать start_param)
      const initData = WebApp.initData;
        let initDataObj: Record<string, string> = {};
        try {
        if (initData) {
            const paramPairs = initData.split('&');
            paramPairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
                initDataObj[key] = decodeURIComponent(value);
            }
            });
        }
        } catch (e) {
        console.error("Error parsing initData:", e);
        }
      
      console.log("URL ref parameter:", refFromUrl);
      console.log("start_param:", startParam);
      console.log("initData parsed:", initDataObj);
      
      // Используем первый доступный параметр
      if (refFromUrl) {
        console.log("Using ref from URL:", refFromUrl);
        return refFromUrl;
      } else if (startParam) {
        console.log("Using start_param:", startParam);
        return startParam;
      } 
      console.log("No referral code found");
      return null;
    };
    
    const code = extractReferralCode();
    if (code) {
      setReferrerCode(code);
    }
  }, [location]);

  useEffect(() => {
    console.log("TonConnect UI initialized", tonConnectUI);
    
    // If wallet is already connected on mount
    if (tonConnectUI.wallet) {
      console.log("Wallet detected on mount:", tonConnectUI.wallet);
      handleAfterConnect();
    }

    // Subscribe to wallet status changes
    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      console.log("Wallet status changed:", wallet);
      if (wallet) {
        handleAfterConnect();
      } else {
        setIsConnected(false);
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI, referrerCode]); // Added referrerCode to dependencies

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          telegramId,
          telegramName,
          referrerCode,
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
      {/* Компонент без изменений */}
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