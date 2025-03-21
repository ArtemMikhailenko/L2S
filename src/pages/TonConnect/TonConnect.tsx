"use client";
import { useEffect, useState } from "react";
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import { useLocation } from "react-router-dom";
import styles from "./TonConnect.module.css";
import WebApp from "@twa-dev/sdk";
import { useTranslation } from "react-i18next";
interface ConfigSettings {
  extensionDuration: number;
  paymentReceiver: string;
  paymentAmount: number;
  freeTrialDuration: number;
}
function TonConnectPage() {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnected, setIsConnected] = useState(false);
  const [accessUntil, setAccessUntil] = useState(null);
  const location = useLocation();
  const [config, setConfig] = useState<ConfigSettings | null>(null);
  const [referrerCode, setReferrerCode] = useState(null);
  const [animateElements, setAnimateElements] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/config/settings`);
        if (!res.ok) {
          throw new Error("Failed to fetch config settings");
        }
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConfig();
  }, []);
  useEffect(() => {
    const extractReferralCode = () => {
      console.log("Extracting referral code...");
      console.log("WebApp data:", WebApp.initDataUnsafe);

      const params = new URLSearchParams(location.search);
      const refFromUrl = params.get("ref");

      const startParam = WebApp.initDataUnsafe?.start_param;

      const initData = WebApp.initData;
      let initDataObj = {};
      try {
        if (initData) {
          const paramPairs = initData.split('&');
          paramPairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
              //@ts-ignore
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
      setReferrerCode(code as any);
    }

    setTimeout(() => {
      setAnimateElements(true);
    }, 300);
  }, [location]);

  useEffect(() => {
    console.log("TonConnect UI initialized", tonConnectUI);

    if (tonConnectUI.wallet) {
      console.log("Wallet detected on mount:", tonConnectUI.wallet);
      handleAfterConnect();
    }

    const unsubscribe = tonConnectUI.onStatusChange(wallet => {
      console.log("Wallet status changed:", wallet);
      if (wallet) {
        handleAfterConnect();
      } else {
        setIsConnected(false);
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI, referrerCode]);

  const handleAfterConnect = async () => {
    const walletAddress = tonConnectUI.wallet?.account.address;
    const telegramId = WebApp.initDataUnsafe?.user?.id;
    const telegramName = WebApp.initDataUnsafe?.user?.first_name;

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
      if (data.user && data.user.accessUntil) {
        setAccessUntil(data.user.accessUntil);
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };
  const extendAccess = async () => {
    const telegramId = WebApp.initDataUnsafe?.user?.id;
    if (!telegramId) {
      console.error("telegramId is missing.");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/extend-access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Access extended:', data.accessUntil);
      setAccessUntil(data.accessUntil);
    } catch (error) {
      console.error('Error extending access:', error);
    }
  };
  const handlePayment = async () => {
    if (!tonConnectUI) {
      console.error("TonConnect UI not initialized");
      return;
    }
    if (!config) {
      console.error("Config settings not loaded");
      return;
    }
    const amount = String(config.paymentAmount);
    const receiver = config.paymentReceiver;
  
    try {
      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360, // Valid for 5 minutes
        messages: [
          {
            address: receiver,
            amount,
            payload: "", 
          },
        ],
      });
      
      console.log("Результат транзакции:", result);
      
      await extendAccess();
    } catch (err) {
      console.error("Ошибка при проведении транзакции:", err);
    }
  };

  // Проверка, истёк ли доступ
  const isAccessExpired = () => {
    if (!accessUntil) return false;
    return new Date(accessUntil) < new Date();
  };

  return (
    <div className={styles.pageContainer}>
      {/* Background decorative elements */}
      <div className={styles.bgElements}>
        <div className={styles.bgCircle}></div>
        <div className={styles.bgDiamond}></div>
        <div className={styles.bgDot}></div>
        <div className={styles.bgDot}></div>
        <div className={styles.bgDot}></div>
      </div>

      {/* Floating quiz elements */}
      <div className={styles.floatingElements}>
        <div className={`${styles.floatingElement} ${styles.questionMark}`}>?</div>
        <div className={`${styles.floatingElement} ${styles.exclamationMark}`}>!</div>
        <div className={`${styles.floatingElement} ${styles.coinIcon}`}>
          <div className={styles.coinInner}>TON</div>
        </div>
      </div>

      <div className={`${styles.container} ${animateElements ? styles.visible : ''}`}>
        <div className={styles.headerDecoration}>
          <div className={styles.decorLine}></div>
          <div className={styles.decorDiamond}></div>
          <div className={styles.decorLine}></div>
        </div>

        <div className={styles.contentWrapper}>
          {/* Logo and header */}
          <div className={styles.logoContainer}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoInner}>
                <div className={styles.logoBrain}>
                  <img src="/logo.png" alt="TON Quiz" />
                </div>
              </div>
            </div>
            <h1 className={styles.title}>{t("title")}</h1>
            <div className={styles.tagline}>{t("tagline")}</div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.subtitle}>{t("connectWallet")}</h2>

            <div className={styles.infoBox}>
              <div className={styles.infoIcon}></div>
              <p className={styles.description}>
                {t("connectDescription")}
              </p>
            </div>

            <div className={styles.walletArea}>
              <TonConnectButton className={styles.connectButton} />
              <div className={styles.supportedWallets}>
                <span className={styles.walletIcon}></span>
                <span className={styles.walletNote}>{t("supportedWallets")}</span>
              </div>
            </div>

            {isConnected && (
              <div className={styles.successMessage}>
                <div className={styles.checkmarkIcon}></div>
                <div className={styles.messageText}>{t("walletConnected")}</div>
              </div>
            )}

            {isConnected && (
              <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
               {isAccessExpired() ? (
                <>
                  <p className={styles.subscriptionText}>
                    {t("subscriptionExpired", "Access expired. To extend your subscription, please pay 0.05 TON.")}
                  </p>
                  <button className={styles.extendButton} onClick={handlePayment}>
                    {t("extendSubscription", "Pay and Extend Subscription")}
                  </button>
                </>
              ) : (
                <p className={styles.subscriptionText}>
                  {t("accessActiveUntil", "Access active until:")} {new Date(accessUntil as any).toLocaleString()}
                </p>
              )}
              </div>
            )}
          </div>

          {/* Benefits section */}
          <div className={styles.benefitsSection}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIconPlay}>
                <img src="/question.svg" alt="" />
              </div>
              <div className={styles.benefitText}>{t("benefitAnswer")}</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIconTrophy}>
                <img src="/win.svg" alt="" />
              </div>
              <div className={styles.benefitText}>{t("benefitWin")}</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIconCoin}>
                <img src="/token.svg" alt="" />
              </div>
              <div className={styles.benefitText}>{t("benefitEarn")}</div>
            </div>
          </div>
        </div>

        <div className={styles.footerDecoration}>
          <div className={styles.footerLine}></div>
        </div>
      </div>
    </div>
  );
}

export default TonConnectPage;
