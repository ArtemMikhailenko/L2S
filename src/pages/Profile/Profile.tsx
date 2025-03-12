"use client";

import { useState, useEffect } from "react";
import { useTonConnectUI } from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";
import styles from "./Profile.module.css";
import { Trophy, Users } from "lucide-react";

// Import components
import ProfileHeader from '../../components/Profile/ProfileHeader/ProfileHeader';
import LevelProgressBar from '../../components/Profile/LevelProgressBar/LevelProgressBar';
import TabNavigation from '../../components/Profile/TabNavigation/TabNavigation';
// import StatsTab from '../../components/Profile/StatsTab/StatisticsTab';
import RankingTab from '../../components/Profile/RankingTab/RankingTab';
import ReferralsTab from '../../components/Profile/ReferralsTab/ReferralsTab';
import { Activity } from '../../components/Profile/ActivityItem/ActivityItem';
import { Rank, Prize } from '../../components/Profile/RankingTab/RankingTab';
import { ReferralInfo, RewardTierInfo } from '../../components/Profile/ReferralsTab/ReferralsTab';

interface UserData {
  firstName: string;
  lastName: string;
  walletAddress: string;
  rating: number;
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
  const [activeTab, setActiveTab] = useState<'stats' | 'ranking' | 'referrals'>('stats');
    //@ts-ignore

  const [tonConnectUI] = useTonConnectUI();
  
  const [userData, setUserData] = useState<UserData | undefined>(undefined);

  //@ts-ignore
  const [weeklyRankings, setWeeklyRankings] = useState<Rank[]>([
    { position: 1, name: 'Alex T.', points: 870, isCurrentUser: false },
    { position: 2, name: 'Maria S.', points: 810, isCurrentUser: false },
    { position: 3, name: 'Sergey K.', points: 790, isCurrentUser: false },
    { position: 4, name: `${ WebApp.initDataUnsafe?.user?.first_name} ${WebApp.initDataUnsafe?.user?.last_name}.`, points: 710, isCurrentUser: true },
    { position: 5, name: 'Pavel D.', points: 650, isCurrentUser: false },
    { position: 6, name: 'Nina L.', points: 620, isCurrentUser: false },
    { position: 7, name: 'Boris M.', points: 590, isCurrentUser: false },
  ]);

  const [referralInfo, setReferralInfo] = useState<ReferralInfo>({
    code: "", // Пока пусто, обновим после получения данных
    referralsCount: 0,
    pointsEarned: 0,
    // nextReward: 100,
    // nextRewardThreshold: 10,
  });

  // Mock activity data
  //@ts-ignore
  const activities: Activity[] = [
    {
      icon: Trophy,
      title: 'Completed "TON Basics" quiz',
      date: 'Today, 14:32',
      points: 120
    },
    {
      icon: Users,
      title: 'New referral joined',
      date: 'Yesterday',
      points: 50
    },
    {
      icon: Trophy,
      title: 'Completed "Blockchain Fundamentals"',
      date: 'Mar 9, 2025',
      points: 80
    }
  ];

  // Mock prize data
  const prizes: Prize[] = [
    { position: 1, name: 'First Place', value: '500 TON' },
    { position: 2, name: 'Second Place', value: '250 TON' },
    { position: 3, name: 'Third Place', value: '100 TON' }
  ];

  // Mock reward tiers
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/telegram/12345`);
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
        totalPoints={userData.referralPoints}
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
        )} */}
        
        {activeTab === 'ranking' && (
          <RankingTab 
            rankings={weeklyRankings}
            prizes={prizes}
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
