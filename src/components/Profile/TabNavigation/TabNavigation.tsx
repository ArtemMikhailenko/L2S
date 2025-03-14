import { Trophy, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from "../../../pages/Profile/Profile.module.css";

type TabType = 'ranking' | 'referrals';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.tabNavigation}>
      <button 
        className={`${styles.tabButton} ${activeTab === 'ranking' ? styles.activeTab : ''}`}
        onClick={() => setActiveTab('ranking')}
      >
        <Trophy size={18} />
        <span>{t("rankings")}</span>
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === 'referrals' ? styles.activeTab : ''}`}
        onClick={() => setActiveTab('referrals')}
      >
        <Users size={18} />
        <span>{t("referrals")}</span>
      </button>
    </div>
  );
};

export default TabNavigation;
