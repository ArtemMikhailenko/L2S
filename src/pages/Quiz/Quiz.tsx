"use client";
import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Quiz.module.css';
import WebApp from '@twa-dev/sdk';
import QuizResult from '../../components/QuizResult/QuizResult';

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
      console.log('User watched the ad');
    }).catch(err => {
      console.error('Error showing ad:', err);
    });
  } else {
    console.warn('show_9078748 is not defined. Check if the script is loaded.');
    return Promise.resolve();
  }
}

const Quiz: React.FC = () => {
  const { t } = useTranslation();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  
  // Get current question
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const handleAnswer = (selected: string) => {
    if (!currentQuestion || feedback !== null) return;
    
    setSelectedAnswer(selected);
    const isCorrect = selected === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? t("correct") : t("wrong"));
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      
      // Add 10 points on the server
      const telegramId = WebApp.initDataUnsafe?.user?.id;
      if (telegramId) {
        fetch(`${import.meta.env.VITE_API_URL}/api/user/add-points`, {
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
    
    setTimerActive(false);
  };
  
  // Fetch questions from backend
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quiz/questions?limit=100`);
      if (!response.ok) {
        throw new Error(t("errorFetchingQuestions"));
      }
      const data = await response.json();
      // Assuming the response object has a "questions" array
      const questionsArray = data.questions;
      setAllQuestions(questionsArray);
  
      // Select 15 random questions
      const shuffled = [...questionsArray].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 15);
      setQuizQuestions(selected);
  
      setTimerActive(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (currentQuestionIndex !== 0 && (currentQuestionIndex + 1) % 5 === 0 && !quizCompleted) {
      showRewardedAd();
    }
  }, [currentQuestionIndex, quizCompleted]);

  useEffect(() => {
    let timer: number | undefined;
    
    if (timerActive && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
        setTotalTimeSpent(prevTotal => prevTotal + 1);
      }, 1000);
    } else if (timeLeft === 0 && currentQuestion) {
      handleTimeUp();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, timerActive, currentQuestion]);

  const handleTimeUp = () => {
    setFeedback(t("timeUp"));
    setSelectedAnswer(null);
    setTimerActive(false);
  };

  const resetQuiz = () => {
    // Reset all states and start a new quiz
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedAnswer(null);
    setTimeLeft(30);
    setTotalTimeSpent(0);
    
    // Get new questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 15);
    setQuizQuestions(selected);
    
    setTimerActive(true);
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    // Check if quiz is completed
    if (nextIndex >= quizQuestions.length) {
      setQuizCompleted(true);
      setTimerActive(false);
      return;
    }
    
    // Move to next question
    setCurrentQuestionIndex(nextIndex);
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

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
        <p>{t("loadingQuestions")}</p>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>❌</div>
        <h3>{t("errorSomethingWentWrong")}</h3>
        <p className={styles.error}>{error}</p>
        <button className={styles.retryButton} onClick={fetchQuestions}>{t("tryAgain")}</button>
      </div>
    );
  }
  
  // Show empty state
  if (quizQuestions.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>📋</div>
        <h3>{t("noQuestions")}</h3>
        <p>{t("pleaseContactSupport")}</p>
      </div>
    );
  }

  // Show quiz result when completed
  if (quizCompleted) {
    return (
      <QuizResult 
        score={score}
        totalQuestions={quizQuestions.length}
        timeSpent={totalTimeSpent}
        onPlayAgain={resetQuiz}
      />
    );
  }

  // Calculate progress
  const progressPercentage = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className={styles.quizContainer}>
    <div className={styles.userInfo}>
      <div className={styles.userName}>
        {WebApp.initDataUnsafe?.user?.first_name || "User"}
      </div>
      <div className={styles.userDate}>
        {new Date().toLocaleDateString()}
      </div>
      <div className={styles.userTime}>
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>

    <div className={styles.summaryCard}>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>{score} Correct Answers</div>
          <div className={styles.statLabel}>{currentQuestionIndex - score} Incorrect Answers</div>
        </div>
        
        <div className={styles.progressCircle}>
          <div className={styles.progressText}>
            {currentQuestionIndex + 1}/{quizQuestions.length}
          </div>
        </div>
        
        <div className={styles.pointsContainer}>
          <div className={styles.pointsLabel}>Today's Points</div>
          <div className={styles.pointsValue}>{score * 10}.0 points</div>
        </div>
      </div>
    </div>
    
    <div className={styles.questionCard}>
      <div className={styles.questionHeader}>
        Question {currentQuestionIndex + 1}: {currentQuestion.question}
      </div>

      <div className={styles.chooseText}>Choose the correct answer:</div>
      
      <div className={styles.optionsContainer}>
        {options.map((option, index) => (
          <button
            key={index}
            className={styles.optionButton}
            onClick={() => handleAnswer(option)}
            disabled={feedback !== null}
          >
            <div className={styles.optionCircle}>
              {String.fromCharCode(65 + index)}
            </div>
            <div className={styles.optionText}>{option}</div>
          </button>
        ))}
      </div>
    </div>
    
    {feedback && (
      <div className={`${styles.feedbackContainer} ${
        feedback === t("correct") 
          ? styles.correctFeedback 
          : styles.wrongFeedback
      }`}>
        <div className={styles.feedbackIcon}>
          {feedback === t("correct") ? '✓' : '✗'}
        </div>
        <div className={styles.feedbackText}>{feedback}</div>
        
        <button 
          className={styles.nextButton} 
          onClick={handleNextQuestion}
        >
          {currentQuestionIndex + 1 === quizQuestions.length ? t("seeResults") : t("nextQuestion")}
          <span className={styles.nextIcon}>→</span>
        </button>
      </div>
    )}
  </div>
  );
};

export default Quiz;
