import { useEffect, useState, useMemo } from 'react';
import styles from './Quiz.module.css';
import { useTonConnectUI } from '@tonconnect/ui-react';
import WebApp from '@twa-dev/sdk';

interface Question {
  _id: string;
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
}
declare global {
    interface Window {
      show_9078748?: (arg?: any) => Promise<void>;
    }
  }
  
  function showRewardedAd() {
    if (typeof window.show_9078748 === 'function') {
      return window.show_9078748().then(() => {
        console.log('Пользователь досмотрел рекламу');
      }).catch(err => {
        console.error('Ошибка при показе рекламы:', err);
      });
    } else {
      console.warn('show_9078748 не определён. Проверьте, подключён ли скрипт.');
      return Promise.resolve();
    }
  }
const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState<Set<string>>(new Set());
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [tonConnectUI] = useTonConnectUI();
//@ts-ignore
  const sendTokens = async (wallet: string, amount: number) => {
    try {
      console.log(`Sending ${amount} tokens to ${wallet}`);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jetton/transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: wallet, amount }),      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null) || await response.text();
        throw new Error(`Token transfer failed: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const result = await response.json();
      console.log('Tokens sent successfully:', result);
      return result;
    } catch (error:any) {
      console.error('Error sending tokens:', error);
      return { success: false, error: error.message };
    }
  };
  
const handleAnswer = (selected: string) => {
    if (!currentQuestion || feedback !== null) return;
    
    setSelectedAnswer(selected);
    const isCorrect = selected === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? 'Correct!' : 'Wrong!');
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    //   sendTokens('UQByL9EhIiBMPP9zp9V-rLaNwlwqybYB1Asa1mmbdcZyFb3G',10)
      // Добавляем 10 очков на сервере
      const telegramId = WebApp.initDataUnsafe?.user?.id; // или откуда вы берёте telegramId
      if (telegramId) {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/add-points `, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId, points: 10 }),
        })
          .then(res => res.json())
          .then(data => {
            console.log('Points added:', data);
          })
          .catch(err => console.error('Error adding points:', err));
      }
    }
    
    setQuestionCount(prevCount => prevCount + 1);
    setTimerActive(false);
  };
  
  // Запрос списка вопросов с бэкенда
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quiz/questions`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data: Question[] = await response.json();
      setQuestions(data);
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const selectedQuestion = data[randomIndex];
        setCurrentQuestion(selectedQuestion);
        setUsedQuestionIds(new Set([selectedQuestion._id]));
        setTimerActive(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);
  useEffect(() => {
    if (questionCount !== 0 && questionCount % 5 === 0) {
      showRewardedAd();
    }
  }, [questionCount]);
  // Timer effect
  useEffect(() => {
    let timer: number | undefined;
    if (timerActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentQuestion) {
      handleTimeUp();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, timerActive]);

  const handleTimeUp = () => {
    setFeedback('Time Up!');
    setSelectedAnswer(null);
    setTimerActive(false);
  };

//@ts-ignore

  const walletAddress = tonConnectUI.wallet?.account.address || '';



  const handleNextQuestion = () => {
    if (questions.length === 0) return;
    const availableQuestions = questions.filter(q => !usedQuestionIds.has(q._id));
    if (availableQuestions.length === 0) {
      setFeedback("You've completed all questions!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const nextQuestion = availableQuestions[randomIndex];
    setCurrentQuestion(nextQuestion);
    setUsedQuestionIds(prev => new Set([...prev, nextQuestion._id]));
    setFeedback(null);
    setSelectedAnswer(null);
    setTimeLeft(30);
    setTimerActive(true);
  };

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    const arr = [...currentQuestion.wrongAnswers, currentQuestion.correctAnswer];
    return arr.sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p>Loading questions...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>❌</div>
        <h3>Something went wrong</h3>
        <p className={styles.error}>{error}</p>
        <button className={styles.retryButton} onClick={fetchQuestions}>Try Again</button>
      </div>
    );
  }
  
  if (!currentQuestion) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>📋</div>
        <h3>No questions available</h3>
        <p>Please check back later or contact support.</p>
      </div>
    );
  }

  const progressPercentage = (usedQuestionIds.size / questions.length) * 100;

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <div className={styles.scoreBoard}>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Score</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Question</span>
            <span className={styles.scoreValue}>{questionCount + 1}/{questions.length}</span>
          </div>
        </div>
        
        <div className={styles.timerContainer}>
          <div className={styles.timerLabel}>Time Left</div>
          <div className={styles.timerValue} style={{ color: timeLeft < 10 ? '#FF5252' : '#801a3d' }}>
            {timeLeft}s
          </div>
          <div className={styles.timerBar}>
            <div 
              className={styles.timerProgress} 
              style={{ 
                width: `${(timeLeft / 30) * 100}%`,
                backgroundColor: timeLeft < 10 ? '#FF5252' : '#801a3d'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressBarFill} 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      <div className={styles.questionCard}>
        <h2 className={styles.questionText}>{currentQuestion.question}</h2>
        
        <div className={styles.optionsContainer}>
          {options.map((option, index) => (
            <button
              key={index}
              className={`${styles.optionButton} ${
                feedback !== null && option === currentQuestion.correctAnswer 
                  ? styles.correctOption 
                  : feedback !== null && option === selectedAnswer 
                  ? styles.wrongOption 
                  : ''
              }`}
              onClick={() => handleAnswer(option)}
              disabled={feedback !== null}
            >
              <span className={styles.optionIndex}>{String.fromCharCode(65 + index)}</span>
              <span className={styles.optionText}>{option}</span>
            </button>
          ))}
        </div>
      </div>
      
      {feedback && (
        <div className={`${styles.feedbackContainer} ${
          feedback === 'Correct!' 
            ? styles.correctFeedback 
            : feedback === 'Time Up!' 
            ? styles.timeUpFeedback 
            : styles.wrongFeedback
        }`}>
          <div className={styles.feedbackIcon}>
            {feedback === 'Correct!' ? '✓' : feedback === 'Time Up!' ? '⏱' : '✗'}
          </div>
          <div className={styles.feedbackText}>{feedback}</div>
          {feedback !== 'Correct!' && currentQuestion && (
            <div className={styles.correctAnswerText}>
              Correct answer: {currentQuestion.correctAnswer}
            </div>
          )}
        </div>
      )}
      
      {feedback && (
        <button 
          className={styles.nextButton} 
          onClick={handleNextQuestion}
        >
          Next Question
          <span className={styles.nextIcon}>→</span>
        </button>
      )}
    </div>
  );
};

export default Quiz;
