// src/components/Layout.tsx
import { Outlet, Link } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <Link to="/">TON Connect</Link> |{' '}
        <Link to="/quiz">Квиз</Link> |{' '}
        <Link to="/profile">Профиль</Link>
      </nav>
      <main style={{ padding: '1rem' }}>
        {/* 
          Здесь будут рендериться дочерние роуты
          (TonConnect, Quiz, Profile), 
          в зависимости от URL
        */}
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
