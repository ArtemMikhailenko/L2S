import { Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from "../../../pages/Profile/Profile.module.css";
import WebApp from "@twa-dev/sdk";
// import RewardTier from '../RewardTier/RewardTier';

export interface ReferralInfo {
  code: string;
  referralsCount: number;
  pointsEarned: number;
}

export interface RewardTierInfo {
  friendCount: number;
  rewardAmount: number;
}

interface ReferralsTabProps {
  referralInfo: ReferralInfo;
  rewardTiers: RewardTierInfo[];
}

function shortenLink(link: string, front = 5, back = 5): string {
  if (link.length <= front + back) return link;
  return `${link.slice(0, front)}...${link.slice(-back)}`;
}
//@ts-ignore
function ReferralsTab({ referralInfo, rewardTiers }: ReferralsTabProps) {
  const { t } = useTranslation();

  // Function to copy referral code
  const copyReferralCode = () => {
    const fullLink = `https://t.me/L2Sbot_bot?startapp=${referralInfo.code}`;
    navigator.clipboard.writeText(fullLink);
    WebApp.showPopup({
      title: t("copied", "Copied!"),
      message: t("referralCodeCopied", "Referral code copied to clipboard")
    });
  };

  // Generate referral links for both web and Telegram bot
  const shareReferralLink = () => {
    const telegramBotLink = `https://t.me/L2Sbot_bot?startapp=${referralInfo.code}`;
    const webAppLink = `${window.location.origin}?ref=${referralInfo.code}`;
    WebApp.showPopup({
      title: t("shareYourLink", "Share your link"),
      message: `${t("telegram", "Telegram")}: ${telegramBotLink}\n\n${t("web", "Web")}: ${webAppLink}`
    });
  };

  const telegramBotLink = `https://t.me/L2Sbot_bot?startapp=${referralInfo.code}`;

  return (
    <div className={styles.referralsTab}>
      <div className={styles.referralStatus}>
        <div className={styles.referralCount}>
          <div className={styles.referralCountValue}>{referralInfo.referralsCount}</div>
          <div className={styles.referralCountLabel}>{t("friendsJoined", "Friends Joined")}</div>
        </div>
        
        <div className={styles.referralPoints}>
          <div className={styles.referralPointsValue}>{referralInfo.pointsEarned}</div>
          <div className={styles.referralPointsLabel}>{t("pointsEarned", "Points Earned")}</div>
        </div>
      </div>
      
      <div className={styles.referralCode}>
        <h3 className={styles.sectionTitle}>{t("yourReferralCode", "Your Referral Code")}</h3>
        <div className={styles.codeContainer}>
          <code className={styles.code}>{shortenLink(telegramBotLink)}</code>
          <button className={styles.copyButton} onClick={copyReferralCode}>
            {t("copied", "Copied!")}
          </button>
        </div>
      </div>
      
      <div className={styles.shareReferral}>
        <button className={styles.shareButton} onClick={shareReferralLink}>
          <Share2 size={18} />
          <span>{t("shareWithFriends", "Share with Friends")}</span>
        </button>
      </div>
      
      {/*
      <div className={styles.referralRewards}>
        <h3 className={styles.sectionTitle}>Rewards</h3>
        <div className={styles.rewardInfo}>
          <p>Invite <strong>{referralInfo.nextRewardThreshold - referralInfo.referralsCount}</strong> more friends to earn <strong>{referralInfo.nextReward} TON</strong></p>
          
          <div className={styles.rewardProgress}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${(referralInfo.referralsCount / referralInfo.nextRewardThreshold) * 100}%` }}
              ></div>
            </div>
            <div className={styles.progressLabels}>
              <span>{referralInfo.referralsCount}</span>
              <span>{referralInfo.nextRewardThreshold}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.rewardTiers}>
          {rewardTiers.map((tier, index) => (
            <RewardTier key={index} tier={tier} />
          ))}
        </div>
      </div>
      */}
    </div>
  );
}

export default ReferralsTab;
