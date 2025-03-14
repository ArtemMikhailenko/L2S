import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      connectWallet: "Connect Your Wallet",
      quiz: "Quiz",
      profile: "Profile",
      welcome: "Welcome to our Telegram Mini App",
      title: "TON QUIZ",
      tagline: "Challenge Your Knowledge",
      connectDescription: "Connect your TON wallet to play the quiz game and earn crypto rewards for your knowledge.",
      supportedWallets: "Tonkeeper, TonHub & others",
      walletConnected: "Wallet connected successfully!",
      benefitAnswer: "Answer Questions",
      benefitWin: "Win Contests",
      benefitEarn: "Earn TON",
    }
  },
  ar: {
    translation: {
      connectWallet: "اتصل بمحفظتك",
      quiz: "اختبار",
      profile: "الملف الشخصي",
      welcome: "مرحبا بكم في تطبيق التليجرام المصغر",
      title: "اختبار TON",
      tagline: "تحدى معرفتك",
      connectDescription: "اتصل بمحفظتك لتلعب لعبة الاختبار وتكسب مكافآت مشفرة مقابل معرفتك.",
      supportedWallets: "Tonkeeper, TonHub & الآخرين",
      walletConnected: "تم الاتصال بالمحفظة بنجاح!",
      benefitAnswer: "أجب عن الأسئلة",
      benefitWin: "افز بالمسابقات",
      benefitEarn: "اكسب TON",
    }
  }
};

i18n
  // Use LanguageDetector to get language from localStorage, querystring, or navigator
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator'],
      // Keys or params to lookup language from
      lookupLocalStorage: 'i18nextLng',
      // Cache user language on
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
