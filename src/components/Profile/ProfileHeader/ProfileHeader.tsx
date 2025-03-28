import React from 'react';
import { Zap } from 'lucide-react';
import { useTonConnectUI } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';
import styles from '../../../pages/Profile/Profile.module.css';
import { useTranslation } from 'react-i18next';

interface TelegramUser {
  first_name?: string;
  last_name?: string;
  photo_url?: string;
  id?: number;
}

const ProfileHeader: React.FC = () => {
  const { t } = useTranslation();
  
  // Retrieve Telegram user data
  const telegramUser = (WebApp.initDataUnsafe?.user as TelegramUser) || {};
  const firstName = telegramUser.first_name || 'User';
  const lastName = telegramUser.last_name || '';
  const profileImage = telegramUser.photo_url || null;
  const telegramID = telegramUser.id || null;
  
  // Get wallet connection data
  const [tonConnectUI] = useTonConnectUI();
  const walletAddress = tonConnectUI.wallet?.account.address || '0x000...0000';

  // Level is static for now (could be dynamic in a real application)
  const level = 1;

  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileAvatar}>
        {profileImage ? (
          <img src={profileImage} alt="Profile" />
        ) : (
          <div className={styles.avatarInitials}>
            {firstName.charAt(0)}
            {lastName.charAt(0)}
          </div>
        )}
        <div className={styles.levelBadge}>
          <Zap size={12} />
          <span>{level}</span>
        </div>
      </div>
      
      <div className={styles.profileInfo}>
        <h2 className={styles.userName}>{firstName} {lastName}</h2>
        <div className={styles.walletInfo}>
          <span className={styles.walletAddress}>
            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
          </span>
        </div>
        <div className={styles.joinedInfo}>
          {t("telegramID")}: {telegramID}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
