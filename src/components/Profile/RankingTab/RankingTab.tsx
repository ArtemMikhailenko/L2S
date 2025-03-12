
import styles from "../../../pages/Profile/Profile.module.css"
import RankingItem from '../RankingItem/RankingItem';
import PrizeItem from '../PrizeItem/PrizeItem';

export interface Rank {
  position: number;
  name: string;
  points: number;
  isCurrentUser: boolean;
}

export interface Prize {
  position: number;
  name: string;
  value: string;
}

interface RankingTabProps {
  rankings: Rank[];
  prizes: Prize[];
}

function RankingTab({ rankings, prizes }: RankingTabProps) {
  return (
    <div className={styles.rankingTab}>
      <div className={styles.rankingHeader}>
        <h3 className={styles.sectionTitle}>Weekly Leaderboard</h3>
        <div className={styles.timeSelector}>
          <button className={styles.activeTime}>This Week</button>
          <button>All Time</button>
        </div>
      </div>
      
      <div className={styles.rankingList}>
        {rankings.map((rank) => (
          <RankingItem key={rank.position} rank={rank} />
        ))}
      </div>
      
      <div className={styles.prizesInfo}>
        <h3 className={styles.sectionTitle}>Weekly Prizes</h3>
        <div className={styles.prizesList}>
          {prizes.map((prize) => (
            <PrizeItem key={prize.position} prize={prize} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RankingTab;