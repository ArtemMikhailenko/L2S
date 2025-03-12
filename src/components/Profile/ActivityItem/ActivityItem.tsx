import { LucideIcon } from 'lucide-react';
import styles from "../../../pages/Profile/Profile.module.css"

export interface Activity {
  icon: LucideIcon;
  title: string;
  date: string;
  points: number;
}

interface ActivityItemProps {
  activity: Activity;
}

function ActivityItem({ activity }: ActivityItemProps) {
  const { icon: Icon, title, date, points } = activity;
  
  return (
    <div className={styles.activityItem}>
      <div className={styles.activityIcon}><Icon size={18} /></div>
      <div className={styles.activityInfo}>
        <div className={styles.activityTitle}>{title}</div>
        <div className={styles.activityMeta}>{date} • +{points} points</div>
      </div>
    </div>
  );
}

export default ActivityItem;