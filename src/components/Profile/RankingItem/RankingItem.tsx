import { Trophy } from 'lucide-react';
import styles from "../../../pages/Profile/Profile.module.css"
import { Rank } from '../RankingTab/RankingTab';

interface RankingItemProps {
  rank: Rank;
}

function RankingItem({ rank }: RankingItemProps) {
  return (
    <div className={`${styles.rankingItem} ${rank.isCurrentUser ? styles.currentUser : ''}`}>
      <div className={styles.rankPosition}>
        {rank.position <= 3 ? (
          <div className={`${styles.topRank} ${styles[`top${rank.position}`]}`}>{rank.position}</div>
        ) : (
          <div className={styles.normalRank}>{rank.position}</div>
        )}
      </div>
      <div className={styles.rankName}>{rank.name}</div>
      <div className={styles.rankPoints}>
        <Trophy size={14} />
        <span>{rank.points}</span>
      </div>
    </div>
  );
}

export default RankingItem;