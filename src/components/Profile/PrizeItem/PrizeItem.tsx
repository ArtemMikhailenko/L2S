import styles from "../../../pages/Profile/Profile.module.css"
import { Prize } from '../RankingTab/RankingTab';

interface PrizeItemProps {
  prize: Prize;
}

function PrizeItem({ prize }: PrizeItemProps) {
  return (
    <div className={styles.prizeItem}>
      <div className={`${styles.prizeRank} ${styles[`${getPlaceClass(prize.position)}`]}`}>
        {prize.position}
      </div>
      <div className={styles.prizeInfo}>
        <div className={styles.prizeName}>{prize.name}</div>
        <div className={styles.prizeValue}>{prize.value}</div>
      </div>
    </div>
  );
}

function getPlaceClass(position: number): string {
  switch (position) {
    case 1: return 'firstPlace';
    case 2: return 'secondPlace';
    case 3: return 'thirdPlace';
    default: return '';
  }
}

export default PrizeItem;