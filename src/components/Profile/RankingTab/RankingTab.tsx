import { useEffect, useState } from 'react';
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
  const [rankings, setRankings] = useState<Rank[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);

  useEffect(() => {
    // Запрашиваем всех пользователей с бекенда
    fetch(`${import.meta.env.VITE_API_URL}/api/user`)
      .then((res) => res.json())
      .then((data) => {
        // Предполагаем, что data — массив пользователей
        // Сортируем по еженедельным очкам (weeklyPoints) в порядке убывания
        const sortedUsers = data.sort((a: any, b: any) => b.weeklyPoints - a.weeklyPoints);
        
        // Преобразуем данные в массив Rank
        const ranks: Rank[] = sortedUsers.map((user: any, index: number) => ({
          position: index + 1,
          name: user.telegramName, // можно использовать user.firstName + " " + user.lastName, если есть
          points: user.weeklyPoints,
          isCurrentUser: user.telegramId === currentUserTelegramId,
        }));
        setRankings(ranks);
      })
      .catch((err) => console.error("Error fetching ranking data:", err));

    // Пример установки данных о призах (можно также получать с сервера)
    setPrizes([
      { position: 1, name: 'First Place', value: '500 TON' },
      { position: 2, name: 'Second Place', value: '250 TON' },
      { position: 3, name: 'Third Place', value: '100 TON' }
    ]);
  }, [currentUserTelegramId]);

  return (
    <div className={styles.rankingTab}>
      <div className={styles.rankingHeader}>
        <h3 className={styles.sectionTitle}>Weekly Leaderboard</h3>
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
};

export default RankingTab;
