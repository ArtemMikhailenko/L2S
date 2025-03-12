import { Trophy, BarChart3, Award, Zap } from 'lucide-react';
import styles from "../../../pages/Profile/Profile.module.css"
import ActivityItem, { Activity } from '../ActivityItem/ActivityItem';

interface StatsTabProps {
  totalPoints: number;
  totalQuizzes: number;
  correctAnswers: number;
  activities: Activity[];
}

function StatsTab({ totalPoints, totalQuizzes, correctAnswers, activities }: StatsTabProps) {
  const accuracy = Math.round((correctAnswers / (totalQuizzes * 10)) * 100);
  
  return (
    <div className={styles.statsTab}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Trophy size={24} /></div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{totalPoints}</div>
            <div className={styles.statLabel}>Total Points</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}><BarChart3 size={24} /></div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{totalQuizzes}</div>
            <div className={styles.statLabel}>Quizzes Completed</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Award size={24} /></div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{accuracy}%</div>
            <div className={styles.statLabel}>Accuracy</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}><Zap size={24} /></div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{correctAnswers}</div>
            <div className={styles.statLabel}>Correct Answers</div>
          </div>
        </div>
      </div>
      
      <div className={styles.recentActivity}>
        <h3 className={styles.sectionTitle}>Recent Activity</h3>
        <div className={styles.activityList}>
          {activities.map((activity, index) => (
            <ActivityItem key={index} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatsTab;