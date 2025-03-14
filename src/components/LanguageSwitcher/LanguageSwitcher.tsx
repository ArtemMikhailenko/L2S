import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Optionally save to localStorage manually:
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${i18n.language === 'en' ? styles.active : ''}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button
        className={`${styles.button} ${i18n.language === 'ar' ? styles.active : ''}`}
        onClick={() => changeLanguage('ar')}
      >
        AR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
