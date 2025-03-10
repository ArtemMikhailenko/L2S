// src/pages/Quiz.tsx
import { useState } from 'react'

interface Question {
  question: string
  options: string[]
  answer: string
}

const questions: Question[] = [
  {
    question: 'Какой язык используется в React?',
    options: ['Python', 'JavaScript', 'C#', 'Java'],
    answer: 'JavaScript'
  },
  {
    question: 'Что такое JSX?',
    options: ['Фреймворк', 'Супергерой', 'Расширение синтаксиса JS', 'Библиотека'],
    answer: 'Расширение синтаксиса JS'
  }
]

function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (selected: string) => {
    if (selected === questions[currentIndex].answer) {
      setScore((prev) => prev + 1)
    }
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setShowResult(true)
    }
  }

  return (
    <div>
      <h2>Квиз</h2>
      {showResult ? (
        <div>
          <h3>Результаты</h3>
          <p>Ваш результат: {score} из {questions.length}</p>
        </div>
      ) : (
        <div>
          <h3>{questions[currentIndex].question}</h3>
          {questions[currentIndex].options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              style={{ display: 'block', margin: '0.5rem 0' }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Quiz
