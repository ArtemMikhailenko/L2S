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
  const [activeTab, setActiveTab] = useState<'weekly' | 'all'>('weekly');
  const [weeklyRankings, setWeeklyRankings] = useState<Rank[]>([]);
  const [allTimeRankings, setAllTimeRankings] = useState<Rank[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);

  useEffect(() => {
    // Fetch all users from the backend
    fetch(`${import.meta.env.VITE_API_URL}/api/user`)
      .then((res) => res.json())
      .then((data) => {
        // Weekly leaderboard - sort by weeklyPoints
        const weeklyUsers = [...data].sort((a: any, b: any) => b.weeklyPoints - a.weeklyPoints);
        const weeklyRanks: Rank[] = weeklyUsers.map((user: any, index: number) => ({
          position: index + 1,
          name: user.telegramName,
          points: user.weeklyPoints,
          isCurrentUser: user.telegramId === currentUserTelegramId,
        }));
        setWeeklyRankings(weeklyRanks);

        // All-time leaderboard - calculate totalPoints (referralPoints + other points)
        const allTimeUsers = [...data].sort((a: any, b: any) => {
          const totalPointsA = (a.referralPoints || 0) + (a.totalPoints || 0);
          const totalPointsB = (b.referralPoints || 0) + (b.totalPoints || 0);
          return totalPointsB - totalPointsA;
        });
        
        const allTimeRanks: Rank[] = allTimeUsers.map((user: any, index: number) => ({
          position: index + 1,
          name: user.telegramName,
          points: (user.referralPoints || 0) + (user.totalPoints || 0),
          isCurrentUser: user.telegramId === currentUserTelegramId,
        }));
        setAllTimeRankings(allTimeRanks);
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
      <div className={styles.tabButtons}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'weekly' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('weekly')}
        >
          {t("weeklyLeaderboard", "Weekly Leaderboard")}
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {t("allTimeLeaderboard", "All-Time Leaderboard")}
        </button>
      </div>

      {activeTab === 'weekly' && (
        <>
          <div className={styles.rankingHeader}>
            <h3 className={styles.sectionTitle}>{t("weeklyLeaderboard", "Weekly Leaderboard")}</h3>
            <span className={styles.pointsInfo}>{t("weeklyPointsInfo", "Based on weekly activity")}</span>
          </div>
          <div className={styles.rankingList}>
            {weeklyRankings.map((rank) => (
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
        </>
      )}

      {activeTab === 'all' && (
        <>
          <div className={styles.rankingHeader}>
            <h3 className={styles.sectionTitle}>{t("allTimeLeaderboard", "All-Time Leaderboard")}</h3>
            <span className={styles.pointsInfo}>{t("allTimePointsInfo", "Referral points + total activity points")}</span>
          </div>
          <div className={styles.rankingList}>
            {allTimeRankings.map((rank) => (
              <RankingItem key={rank.position} rank={rank} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RankingTab;