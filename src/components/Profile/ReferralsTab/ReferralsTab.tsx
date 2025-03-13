import { Share2 } from 'lucide-react';
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
  
  //@ts-ignore
  function ReferralsTab({ referralInfo, rewardTiers }: ReferralsTabProps) {
    // Function to copy referral code
    const copyReferralCode = () => {
      navigator.clipboard.writeText(referralInfo.code);
      WebApp.showPopup({
        title: "Copied!",
        message: "Referral code copied to clipboard"
      });
    };
  
    // Generate consistent referral links for both web and telegram bot
    const shareReferralLink = () => {
      // For Telegram Bot deep linking
      const telegramBotLink = `https://t.me/L2Sbot_bot?startapp=${referralInfo.code}`;
      
      // For Web App direct link 
      const webAppLink = `${window.location.origin}?ref=${referralInfo.code}`;
      
      WebApp.showPopup({
        title: "Share your link",
        message: `Share these links with friends:\n\nTelegram: ${telegramBotLink}\n\nWeb: ${webAppLink}`
      });
    };
    const telegramBotLink = `https://t.me/L2Sbot_bot?startapp=${referralInfo.code}`;

  return (
    <div className={styles.referralsTab}>
    <div className={styles.referralStatus}>
      <div className={styles.referralCount}>
        <div className={styles.referralCountValue}>{referralInfo.referralsCount}</div>
        <div className={styles.referralCountLabel}>Friends Joined</div>
      </div>
      
      <div className={styles.referralPoints}>
        <div className={styles.referralPointsValue}>{referralInfo.pointsEarned}</div>
        <div className={styles.referralPointsLabel}>Points Earned</div>
      </div>
    </div>
    
    <div className={styles.referralCode}>
      <h3 className={styles.sectionTitle}>Your Referral Code</h3>
      <div className={styles.codeContainer}>
        <code className={styles.code}>{telegramBotLink}</code>
        <button className={styles.copyButton} onClick={copyReferralCode}>
          Copy
        </button>
      </div>
    </div>
    
    <div className={styles.shareReferral}>
      <button className={styles.shareButton} onClick={shareReferralLink}>
        <Share2 size={18} />
        <span>Share with Friends</span>
      </button>
    </div>
      
      {/* Если требуется дополнительный блок наград, раскомментируйте и доработайте его */}
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
