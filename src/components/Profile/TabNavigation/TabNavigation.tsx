import { PieChart, Trophy, Users } from 'lucide-react';
import styles from "../../../pages/Profile/Profile.module.css"

type TabType = 'stats' | 'ranking' | 'referrals';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  return (
    <div className={styles.tabNavigation}>
      <button 
        className={`${styles.tabButton} ${activeTab === 'stats' ? styles.activeTab : ''}`}
        onClick={() => setActiveTab('stats')}
      >
        <PieChart size={18} />
        <span>Statistics</span>
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === 'ranking' ? styles.activeTab : ''}`}
        onClick={() => setActiveTab('ranking')}
      >
        <Trophy size={18} />
        <span>Rankings</span>
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === 'referrals' ? styles.activeTab : ''}`}
        onClick={() => setActiveTab('referrals')}
      >
        <Users size={18} />
        <span>Referrals</span>
      </button>
    </div>
  );
}

export default TabNavigation;