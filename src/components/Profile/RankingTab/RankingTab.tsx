import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from "../../../pages/Profile/Profile.module.css";
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
  currentUserTelegramId: any;
}

const RankingTab: React.FC<RankingTabProps> = ({ currentUserTelegramId }) => {
  const { t } = useTranslation();
  const [rankings, setRankings] = useState<Rank[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);

  useEffect(() => {
    // Fetch all users from the backend
    fetch(`${import.meta.env.VITE_API_URL}/api/user`)
      .then((res) => res.json())
      .then((data) => {
        // Assume data is an array of users
        // Sort by weeklyPoints in descending order
        const sortedUsers = data.sort((a: any, b: any) => b.weeklyPoints - a.weeklyPoints);
        
        // Convert data into an array of Rank objects
        const ranks: Rank[] = sortedUsers.map((user: any, index: number) => ({
          position: index + 1,
          name: user.telegramName, // You may combine firstName and lastName if available
          points: user.weeklyPoints,
          isCurrentUser: user.telegramId === currentUserTelegramId,
        }));
        setRankings(ranks);
      })
      .catch((err) => console.error("Error fetching ranking data:", err));

    // Set example prize data (you can also fetch this from the server)
    setPrizes([
      { position: 1, name: t("firstPlace", "First Place"), value: "500 TON" },
      { position: 2, name: t("secondPlace", "Second Place"), value: "250 TON" },
      { position: 3, name: t("thirdPlace", "Third Place"), value: "100 TON" }
    ]);
  }, [currentUserTelegramId, t]);

  return (
    <div className={styles.rankingTab}>
      <div className={styles.rankingHeader}>
        <h3 className={styles.sectionTitle}>{t("weeklyLeaderboard", "Weekly Leaderboard")}</h3>
      </div>
      
      <div className={styles.rankingList}>
        {rankings.map((rank) => (
          <RankingItem key={rank.position} rank={rank} />
        ))}
      </div>
      
      <div className={styles.prizesInfo}>
        <h3 className={styles.sectionTitle}>{t("weeklyPrizes", "Weekly Prizes")}</h3>
        <div className={styles.prizesList}>
          {prizes.map((prize) => (
            <PrizeItem key={prize.position} prize={prize} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankingTab;
