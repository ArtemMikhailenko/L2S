import styles from "../../../pages/Profile/Profile.module.css"

interface LevelProgressBarProps {
  currentLevel: number;
  totalPoints: number;
}

function LevelProgressBar({ currentLevel, totalPoints }: LevelProgressBarProps) {
  const progressToNextLevel = ((totalPoints % 500) / 500) * 100;
  
  return (
    <div className={styles.levelProgress}>
      <div className={styles.levelInfo}>
        <span>Level {currentLevel}</span>
        <span>Level {currentLevel + 1}</span>
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${progressToNextLevel}%` }}
        ></div>
      </div>
      <div className={styles.pointsInfo}>
        {totalPoints % 500} / 500 points to next level
      </div>
    </div>
  );
}

export default LevelProgressBar;