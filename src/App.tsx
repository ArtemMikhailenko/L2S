// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TonConnect from './pages/TonConnect/TonConnect'
import Quiz from './pages/Quiz/Quiz'
import Profile from './pages/Profile/Profile'
import './App.css'

function App() {
  return (
    <Routes>
      {/* 
        Общий Layout для всех страниц
        Можно обернуть <Routes> в <Layout>, либо использовать Nested Routes 
      */}
      <Route path="/" element={<Layout />}>
        <Route index element={<TonConnect />} />
        
        <Route path="quiz" element={<Quiz />} />
        
        <Route path="profile" element={<Profile />} />
        
   
        <Route path="*" element={<div>Страница не найдена</div>} />
      </Route>
    </Routes>
  )
}

export default App
