import { useNavigate, useLocation } from 'react-router-dom'
import './BottomNav.css'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav__item ${pathname === '/home' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => navigate('/home')}
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
          <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
        <span>Home</span>
      </button>

      <button
        className={`bottom-nav__item ${pathname === '/chat' ? 'bottom-nav__item--active' : ''}`}
        onClick={() => navigate('/chat')}
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M14 10.667A1.333 1.333 0 0112.667 12H4.667L2 14.667V3.333A1.333 1.333 0 013.333 2h9.334A1.333 1.333 0 0114 3.333v7.334z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Chat</span>
      </button>
    </nav>
  )
}
