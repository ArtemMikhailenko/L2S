import { useEffect, useState, useMemo } from 'react';
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
    setFeedback(isCorrect ? 'Correct!' : 'Wrong!');
    
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
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      // Извлекаем массив вопросов из объекта ответа
      const questionsArray = data.questions;
      setAllQuestions(questionsArray);
  
      // Выбираем 15 случайных вопросов
      const shuffled = [...questionsArray].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 15);
      setQuizQuestions(selected);
  
      setTimerActive(true);
      setLoading(false);
    } catch (err:any) {
      setError(err.message);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (currentQuestionIndex !== 0 && currentQuestionIndex % 5 === 0 && !quizCompleted) {
      showRewardedAd();
    }
  }, [currentQuestionIndex]);

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
    setFeedback('Time Up!');
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
        <p>Loading questions...</p>
      </div>
    );
  }
  
  // Show error state
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
  
  // Show empty state
  if (quizQuestions.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>📋</div>
        <h3>No questions available</h3>
        <p>Please check back later or contact support.</p>
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
      <div className={styles.quizHeader}>
        <div className={styles.scoreBoard}>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Score</span>
            <span className={styles.scoreValue}>{score}</span>
          </div>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Question</span>
            <span className={styles.scoreValue}>{currentQuestionIndex + 1}/{quizQuestions.length}</span>
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
             
            </div>
          )}
        </div>
      )}
      
      {feedback && (
        <button 
          className={styles.nextButton} 
          onClick={handleNextQuestion}
        >
          {currentQuestionIndex + 1 === quizQuestions.length ? 'See Results' : 'Next Question'}
          <span className={styles.nextIcon}>→</span>
        </button>
      )}
    </div>
  );
};

export default Quiz;