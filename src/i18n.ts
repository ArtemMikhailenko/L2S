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
      score: "Score",
      question: "Question",
      timeLeft: "Time Left",
      nextQuestion: "Next Question",
      seeResults: "See Results",
      correct: "Correct!",
      wrong: "Wrong!",
      timeUp: "Time Up!",
      loadingQuestions: "Loading questions...",
      errorSomethingWentWrong: "Something went wrong",
      tryAgain: "Try Again",
      noQuestions: "No questions available",
      pleaseContactSupport: "Please check back later or contact support.",
      points: "points",
      levelText: "Level {{level}}",
      pointsToNextLevel: "{{points}} / 500 points to next level",
       telegramID: "Telegram ID",
        rankings: "Rankings",
      referrals: "Referrals",
      weeklyLeaderboard: "Weekly Leaderboard",
      weeklyPrizes: "Weekly Prizes",
      firstPlace: "First Place",
      secondPlace: "Second Place",
      thirdPlace: "Third Place",
      yourReferralCode: "Your Referral Code",
      friendsJoined: "Friends Joined",
      pointsEarned: "Points Earned",
      copied: "Copied!",
      referralCodeCopied: "Referral code copied to clipboard",
      shareYourLink: "Share your link",
      telegram: "Telegram",
      web: "Web",
      shareWithFriends: "Share with Friends"
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
      score: "النقاط",
      question: "السؤال",
      timeLeft: "الوقت المتبقي",
      nextQuestion: "السؤال التالي",
      seeResults: "عرض النتائج",
      correct: "صحيح!",
      wrong: "خطأ!",
      timeUp: "انتهى الوقت!",
      loadingQuestions: "جارٍ تحميل الأسئلة...",
      errorSomethingWentWrong: "حدث خطأ ما",
      tryAgain: "أعد المحاولة",
      noQuestions: "لا توجد أسئلة متاحة",
      pleaseContactSupport: "يرجى المحاولة لاحقًا أو الاتصال بالدعم.",
       points: "نقاط",
    levelText: "المستوى {{level}}",
    pointsToNextLevel: "{{points}} / 500 نقطة للوصول إلى المستوى التالي",
    telegramID: "معرّف تلغرام",
     rankings: "الترتيب",
      referrals: "الإحالات",
      weeklyLeaderboard: "الترتيب الأسبوعي",
      weeklyPrizes: "الجوائز الأسبوعية",
      firstPlace: "المركز الأول",
      secondPlace: "المركز الثاني",
      thirdPlace: "المركز الثالث",
      yourReferralCode: "رمز الإحالة الخاص بك",
      friendsJoined: "الأصدقاء الملتحقون",
      pointsEarned: "النقاط المكتسبة",
      copied: "تم النسخ!",
      referralCodeCopied: "تم نسخ رمز الإحالة إلى الحافظة",
      shareYourLink: "شارك رابطك",
      telegram: "تليجرام",
      web: "ويب",
      shareWithFriends: "شارك مع الأصدقاء"

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
