import { useEffect, useState } from 'react';
import styles from './QuizResult.module.css';
import { useTonConnectUI } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  onPlayAgain: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ 
  score, 
  totalQuestions, 
  timeSpent,
  onPlayAgain 
}) => {
  const [tonConnectUI] = useTonConnectUI();
  const [isTokenSent, setIsTokenSent] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate reward tokens: 5 tokens for correct answers, 1 for incorrect
  useEffect(() => {
    const correctAnswers = score;
    const incorrectAnswers = totalQuestions - score;
    const tokensEarned = (correctAnswers * 5) + (incorrectAnswers * 1);
    setTokenAmount(tokensEarned);
  }, [score, totalQuestions]);

  // Send tokens when component mounts
  useEffect(() => {
    const sendTokensToUser = async () => {
      try {
        setLoading(true);
        
        // Get wallet address or telegram ID
        const walletAddress = tonConnectUI.wallet?.account.address;
        const telegramId = WebApp.initDataUnsafe?.user?.id;
        
        if (!walletAddress && !telegramId) {
          throw new Error('No wallet address or Telegram ID available');
        }
        
        // Call API to send tokens
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jetton/transfer`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            address: walletAddress || '', 
            telegramId: telegramId || '',
            amount: tokenAmount 
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null) || await response.text();
          throw new Error(`Token transfer failed: ${response.status} - ${JSON.stringify(errorData)}`);
        }
        
        const result = await response.json();
        console.log('Tokens sent successfully:', result);
        setIsTokenSent(true);
      } catch (error: any) {
        console.error('Error sending tokens:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (tokenAmount > 0 && !isTokenSent) {
      sendTokensToUser();
    }
  }, [tokenAmount, tonConnectUI.wallet?.account.address, isTokenSent]);

  // Calculate percentage score
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Format time spent
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Get message based on score percentage
  const getMessage = (): string => {
    if (percentage >= 90) return "Excellent! You're a crypto expert!";
    if (percentage >= 70) return "Great job! Very impressive knowledge!";
    if (percentage >= 50) return "Good effort! Keep learning!";
    return "Keep studying! There's always room to improve!";
  };

  return (
    <div className={styles.resultContainer}>
      <div className={styles.resultTicket}>
        <div className={styles.ticketHeader}>
          <h2 className={styles.ticketTitle}>Quiz Results</h2>
          <div className={styles.ticketDecoration}></div>
        </div>
        
        <div className={styles.scoreSection}>
          <div className={styles.scoreCircle}>
            <div className={styles.scoreValue}>{score}</div>
            <div className={styles.scoreTotal}>/{totalQuestions}</div>
          </div>
          <div className={styles.scorePercentage}>{percentage}%</div>
        </div>
        
        <div className={styles.statsSection}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Time:</span>
            <span className={styles.statValue}>{formatTime(timeSpent)}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Correct:</span>
            <span className={styles.statValue}>{score} questions</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Incorrect:</span>
            <span className={styles.statValue}>{totalQuestions - score} questions</span>
          </div>
        </div>
        
        <div className={styles.rewardSection}>
          <div className={styles.rewardTitle}>🎁 Rewards Earned</div>
          <div className={styles.rewardValue}>
            {loading ? (
              <div className={styles.rewardLoading}>Sending tokens...</div>
            ) : error ? (
              <div className={styles.rewardError}>
                Failed to send tokens: {error}
              </div>
            ) : isTokenSent ? (
              <div className={styles.rewardSuccess}>
                {tokenAmount} tokens sent successfully!
              </div>
            ) : (
              <div className={styles.rewardPending}>
                {tokenAmount} tokens pending...
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.messageSection}>
          <p className={styles.message}>{getMessage()}</p>
        </div>
        
        <button 
          className={styles.playAgainButton} 
          onClick={onPlayAgain}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default QuizResult;