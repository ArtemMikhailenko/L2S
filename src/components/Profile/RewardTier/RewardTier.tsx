import { ArrowRight } from 'lucide-react';
import styles from "../../../pages/Profile/Profile.module.css"
import { RewardTierInfo } from '../ReferralsTab/ReferralsTab';

interface RewardTierProps {
  tier: RewardTierInfo;
}

function RewardTier({ tier }: RewardTierProps) {
  return (
    <div className={styles.rewardTier}>
      <div className={styles.tierCount}>{tier.friendCount} Friends</div>
      <div className={styles.tierReward}>{tier.rewardAmount} TON</div>
      <ArrowRight size={14} />
    </div>
  );
}

export default RewardTier;