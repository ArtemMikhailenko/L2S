"use client";

import { useState, useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";
import styles from "./Profile.module.css";

// Import components
import ProfileHeader from '../../components/Profile/ProfileHeader/ProfileHeader';
import LevelProgressBar from '../../components/Profile/LevelProgressBar/LevelProgressBar';
import TabNavigation from '../../components/Profile/TabNavigation/TabNavigation';
// import StatsTab from '../../components/Profile/StatsTab/StatisticsTab';
import RankingTab from '../../components/Profile/RankingTab/RankingTab';
import ReferralsTab from '../../components/Profile/ReferralsTab/ReferralsTab';
//@ts-ignore

import { Rank, Prize } from '../../components/Profile/RankingTab/RankingTab';
import { ReferralInfo, RewardTierInfo } from '../../components/Profile/ReferralsTab/ReferralsTab';

interface UserData {
  firstName: string;
  lastName: string;
  walletAddress: string;
  rating: number;
  telegramId:number;
  totalQuizzes: number;
  correctAnswers: number;
  totalPoints: number;
  level: number;
  joinedDate: string;
  profileImage?: string;
  referralCode: string;
  referralsCount:any;
  referralPoints:any;
}

function Profile() {
  const [activeTab, setActiveTab] = useState<  'ranking' | 'referrals'>('ranking');
    //@ts-ignore

  const [tonConnectUI] = useTonConnectUI();
  
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
    const telegramID = WebApp.initDataUnsafe?.user?.id
  //@ts-ignore


  const [referralInfo, setReferralInfo] = useState<ReferralInfo>({
    code: "", // Пока пусто, обновим после получения данных
    referralsCount: 0,
    pointsEarned: 0,
    // nextReward: 100,
    // nextRewardThreshold: 10,
  });



 

  const rewardTiers: RewardTierInfo[] = [
    { friendCount: 5, rewardAmount: 50 },
    { friendCount: 10, rewardAmount: 100 },
    { friendCount: 25, rewardAmount: 300 },
    { friendCount: 50, rewardAmount: 750 }
  ];

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/telegram/${telegramID}`);
        const data: UserData = await response.json();
        setUserData(data);
        setReferralInfo(prev => ({ ...prev, code: data.referralCode, referralsCount: data.referralsCount, pointsEarned: data.referralPoints }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchUserData();
  }, []);

  // Пока данные не получены, показываем загрузку
  if (!userData) {
    return (
      <div className={styles.profileContainer}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      {/* Header with user info */}
      <ProfileHeader 
        // Если компонента ProfileHeader теперь берет данные из WebApp и TON Connect, 
        // можно оставить пустыми или убрать props
      />

      {/* Level progress bar */}
      <LevelProgressBar 
        currentLevel={userData.level}
        totalPoints={userData.referralPoints + userData.totalPoints}
      />

      {/* Navigation tabs */}
      <TabNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab content */}
      <div className={styles.tabContent}>
        {/* {activeTab === 'stats' && (
          <StatsTab 
            totalPoints={userData.totalPoints}
            totalQuizzes={userData.totalQuizzes}
            correctAnswers={userData.correctAnswers}
            activities={activities}
          />
        )}
         */}
        {activeTab === 'ranking' && (
          <RankingTab 
            currentUserTelegramId={telegramID}
          />
        )}
        
        {activeTab === 'referrals' && (
          <ReferralsTab 
            referralInfo={referralInfo}
            rewardTiers={rewardTiers}
          />
        )}
      </div>
    </div>
  );
}

export default Profile;
