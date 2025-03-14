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
      startQuiz: "Start Quiz",
      score: "Score",
      question: "Question",
      timeLeft: "Time Left",
      nextQuestion: "Next Question",
      seeResults: "See Results",
      correct: "Correct!",
      wrong: "Wrong!",
      timeUp: "Time Up!",
      tryAgain: "Try Again",
      loadingQuestions: "Loading questions...",
      noQuestions: "No questions available. Please check back later or contact support."
      // ... add other keys as needed
    }
  },
  ar: {
    translation: {
      connectWallet: "اتصل بمحفظتك",
      quiz: "اختبار",
      profile: "الملف الشخصي",
      welcome: "مرحبًا بكم في تطبيق التليجرام المصغر الخاص بنا",
      startQuiz: "ابدأ الاختبار",
      score: "النقاط",
      question: "السؤال",
      timeLeft: "الوقت المتبقي",
      nextQuestion: "السؤال التالي",
      seeResults: "عرض النتائج",
      correct: "صحيح!",
      wrong: "خطأ!",
      timeUp: "انتهى الوقت!",
      tryAgain: "أعد المحاولة",
      loadingQuestions: "جارٍ تحميل الأسئلة...",
      noQuestions: "لا توجد أسئلة متاحة. يرجى المحاولة لاحقًا أو الاتصال بالدعم."
      // ... add additional keys as needed
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
