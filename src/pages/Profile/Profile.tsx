import { useState, useEffect } from 'react';
import { useTonConnectUI } from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";
import styles from "./Profile.module.css";
import { Trophy, Users } from 'lucide-react';

// Import components
import ProfileHeader from '../../components/Profile/ProfileHeader/ProfileHeader';
import LevelProgressBar from '../../components/Profile/LevelProgressBar/LevelProgressBar';
import TabNavigation from '../../components/Profile/TabNavigation/TabNavigation';
import StatsTab from '../../components/Profile/StatsTab/StatisticsTab';
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
}

function Profile() {
  const [activeTab, setActiveTab] = useState<'stats' | 'ranking' | 'referrals'>('stats');
  const [tonConnectUI] = useTonConnectUI();
  
//@ts-ignore
const [userData, setUserData] = useState<UserData>({
    firstName: WebApp.initDataUnsafe?.user?.first_name || 'Иван',
    lastName: WebApp.initDataUnsafe?.user?.last_name || 'Иванов',
    walletAddress: tonConnectUI.wallet?.account.address || '0x123...abc',
    rating: 4.5,
    totalQuizzes: 32,
    correctAnswers: 187,
    totalPoints: 2450,
    level: 7,
    joinedDate: '10 Jan 2025'
  });
//@ts-ignore
  const [weeklyRankings, setWeeklyRankings] = useState<Rank[]>([
    { position: 1, name: 'Alex T.', points: 870, isCurrentUser: false },
    { position: 2, name: 'Maria S.', points: 810, isCurrentUser: false },
    { position: 3, name: 'Sergey K.', points: 790, isCurrentUser: false },
    { position: 4, name: `${userData.firstName} ${userData.lastName.charAt(0)}.`, points: 710, isCurrentUser: true },
    { position: 5, name: 'Pavel D.', points: 650, isCurrentUser: false },
    { position: 6, name: 'Nina L.', points: 620, isCurrentUser: false },
    { position: 7, name: 'Boris M.', points: 590, isCurrentUser: false },
  ]);
//@ts-ignore

  const [referralInfo, setReferralInfo] = useState<ReferralInfo>({
    code: 'TONQUIZ123',
    referralsCount: 7,
    pointsEarned: 350,
    nextReward: 100,
    nextRewardThreshold: 10
  });

  // Mock activity data
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
    // In a real app, you would fetch the user's data here
    // Example:
    // async function fetchUserData() {
    //   try {
    //     const response = await fetch(`http://localhost:3001/api/user/${telegramId}`);
    //     const data = await response.json();
    //     setUserData(data);
    //   } catch (error) {
    //     console.error('Error fetching user data:', error);
    //   }
    // }
    // fetchUserData();
  }, []);

  return (
    <div className={styles.profileContainer}>
      {/* Header with user info */}
      <ProfileHeader 
        // firstName={userData.firstName}
        // lastName={userData.lastName}
        // walletAddress={userData.walletAddress}
        // level={userData.level}
        // joinedDate={userData.joinedDate}
        // profileImage={userData.profileImage}
      />

      {/* Level progress bar */}
      <LevelProgressBar 
        currentLevel={userData.level}
        totalPoints={userData.totalPoints}
      />

      {/* Navigation tabs */}
      <TabNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Tab content */}
      <div className={styles.tabContent}>
        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <StatsTab 
            totalPoints={userData.totalPoints}
            totalQuizzes={userData.totalQuizzes}
            correctAnswers={userData.correctAnswers}
            activities={activities}
          />
        )}
        
        {/* Rankings Tab */}
        {activeTab === 'ranking' && (
          <RankingTab 
            rankings={weeklyRankings}
            prizes={prizes}
          />
        )}
        
        {/* Referrals Tab */}
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