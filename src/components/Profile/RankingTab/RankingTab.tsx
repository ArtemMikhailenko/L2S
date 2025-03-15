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
  const [weeklyRankings, setWeeklyRankings] = useState<Rank[]>([]);
  const [allTimeRankings, setAllTimeRankings] = useState<Rank[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [activeTab, setActiveTab] = useState<"weekly" | "allTime">("weekly");

  useEffect(() => {
    // Получаем всех пользователей
    fetch(`${import.meta.env.VITE_API_URL}/api/user`)
      .then((res) => res.json())
      .then((data) => {
        // Еженедельный лидерборд: сортировка по weeklyPoints по убыванию
        const weeklySorted = [...data].sort((a: any, b: any) => b.weeklyPoints - a.weeklyPoints);
        const weeklyRanks: Rank[] = weeklySorted.map((user: any, index: number) => ({
          position: index + 1,
          name: user.telegramName,
          points: user.weeklyPoints,
          isCurrentUser: user.telegramId === currentUserTelegramId,
        }));
        setWeeklyRankings(weeklyRanks);

        // Общий лидерборд: сортировка по (totalPoints + referralPoints)
        const allTimeSorted = [...data].sort((a: any, b: any) => 
          (b.totalPoints + b.referralPoints) - (a.totalPoints + a.referralPoints)
        );
        const allTimeRanks: Rank[] = allTimeSorted.map((user: any, index: number) => ({
          position: index + 1,
          name: user.telegramName,
          points: user.totalPoints + user.referralPoints,
          isCurrentUser: user.telegramId === currentUserTelegramId,
        }));
        setAllTimeRankings(allTimeRanks);
      })
      .catch((err) => console.error("Error fetching ranking data:", err));

    // Пример призовых мест (можно заменить или получать с сервера)
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
          className={activeTab === "weekly" ? styles.activeTab : ""}
          onClick={() => setActiveTab("weekly")}
        >
          {t("weeklyLeaderboard", "Weekly Leaderboard")}
        </button>
        <button
          className={activeTab === "allTime" ? styles.activeTab : ""}
          onClick={() => setActiveTab("allTime")}
        >
          {t("allTimeLeaderboard", "All-Time Leaderboard")}
        </button>
      </div>

      {activeTab === "weekly" && (
        <>
          <div className={styles.rankingHeader}>
            <h3 className={styles.sectionTitle}>{t("weeklyLeaderboard", "Weekly Leaderboard")}</h3>
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

      {activeTab === "allTime" && (
        <>
          <div className={styles.rankingHeader}>
            <h3 className={styles.sectionTitle}>{t("allTimeLeaderboard", "All-Time Leaderboard")}</h3>
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
