"use client";
import { useEffect, useState } from "react";
import { TonConnectButton, useTonConnectUI } from "@tonconnect/ui-react";
import { useLocation } from "react-router-dom";
import styles from "./TonConnect.module.css";
import WebApp from "@twa-dev/sdk";
import { useTranslation } from "react-i18next";

function TonConnectPage() {
  const [tonConnectUI] = useTonConnectUI();
  const [isConnected, setIsConnected] = useState(false);
  const location = useLocation();
  const [referrerCode, setReferrerCode] = useState(null);
  const [animateElements, setAnimateElements] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Extract referral code from various possible sources
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
    if (code as any) {
      setReferrerCode(code as any);
    }

    setTimeout(() => {
      setAnimateElements(true);
    }, 300);
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
    } catch (error) {
      console.error("Auth error:", error);
    }
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