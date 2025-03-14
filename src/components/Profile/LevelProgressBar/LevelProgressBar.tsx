import { useTranslation } from 'react-i18next';
import styles from "../../../pages/Profile/Profile.module.css";

interface LevelProgressBarProps {
  currentLevel: number;
  totalPoints: number;
}

function LevelProgressBar({ currentLevel, totalPoints }: LevelProgressBarProps) {
  const { t } = useTranslation();
  const progressToNextLevel = ((totalPoints % 500) / 500) * 100;
  
  return (
    <div className={styles.levelProgress}>
      <div className={styles.levelInfo}>
        <span>{t("levelText", { level: currentLevel })}</span>
        <span>{t("levelText", { level: currentLevel + 1 })}</span>
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progressToNextLevel}%` }}
        ></div>
      </div>
      <div className={styles.pointsInfo}>
        {t("pointsToNextLevel", { points: totalPoints % 500 })}
      </div>
    </div>
  );
}

export default LevelProgressBar;
