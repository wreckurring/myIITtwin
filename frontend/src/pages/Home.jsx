import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitLog, getLogs } from '../services/api'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [userId, setUserId] = useState(null)
  const [logText, setLogText] = useState('')
  const [logs, setLogs] = useState([])
  const [recentChat, setRecentChat] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('myiittwin_profile')
    const uid = localStorage.getItem('myiittwin_userId')
    if (!raw) { navigate('/onboarding'); return }
    const p = JSON.parse(raw)
    setProfile(p)
    setUserId(uid || p.userId)

    // Load logs from backend
    const id = uid || p.userId
    if (id) {
      getLogs(id).then(setLogs).catch(() => {
        // Fall back to localStorage if backend is down
        const saved = JSON.parse(localStorage.getItem('myiittwin_logs') || '[]')
        setLogs(saved)
      })
    }
  }, [navigate])

  async function handleLogSubmit(e) {
    e.preventDefault()
    if (!logText.trim() || !userId) return
    setSubmitting(true)
    setError(null)

    try {
      const result = await submitLog(userId, logText.trim())
      const updated = [...logs, result]
      setLogs(updated)
      setRecentChat([
        { role: 'user', text: logText.trim(), time: 'just now' },
        { role: 'aryan', text: result.aryanReply, time: 'just now' },
      ])
      setLogText('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!profile) return null

  const greeting = getGreeting()

  return (
    <div className="home">
      {/* Sidebar */}
      <aside className="home__sidebar">
        <div className="home__logo">my<span className="accent">IIT</span>twin</div>

        <nav className="home__nav">
          <button className="home__nav-item home__nav-item--active">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            Home
          </button>
          <button className="home__nav-item" onClick={() => navigate('/chat')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 10.667A1.333 1.333 0 0112.667 12H4.667L2 14.667V3.333A1.333 1.333 0 013.333 2h9.334A1.333 1.333 0 0114 3.333v7.334z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Chat with Aryan
          </button>
        </nav>

        <div className="home__sidebar-footer">
          <div className="home__profile-chip">
            <div className="home__avatar">{profile.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="home__profile-name">{profile.name}</div>
              <div className="home__profile-meta">{profile.semester}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="home__main">
        <header className="home__header">
          <div>
            <p className="home__greeting">{greeting}</p>
            <h1 className="home__title serif">{profile.name}</h1>
          </div>
          <div className="home__streak">
            <span className="home__streak-num">{logs.length}</span>
            <span className="home__streak-label">weeks logged</span>
          </div>
        </header>

        {/* Weekly log card */}
        <section className="home__log-section">
          <div className="home__section-label">this week's log</div>
          <form className="home__log-card" onSubmit={handleLogSubmit}>
            <div className="home__log-prompt">what did you get done this week?</div>
            <textarea
              className="home__log-input"
              value={logText}
              onChange={e => setLogText(e.target.value)}
              placeholder="be honest — studies, projects, random stuff, non-coding things too..."
              rows={3}
              disabled={submitting}
            />
            {error && <p className="home__log-error">{error}</p>}
            <div className="home__log-footer">
              <span className="home__log-hint">Aryan will react to this</span>
              <button type="submit" className="home__log-btn" disabled={!logText.trim() || submitting}>
                {submitting ? (
                  <span className="home__log-loading"><span /><span /><span /></span>
                ) : 'send →'}
              </button>
            </div>
          </form>
        </section>

        {/* Recent chat from log reaction */}
        {recentChat.length > 0 && (
          <section className="home__chat-section">
            <div className="home__section-label">
              aryan's reaction
              <button className="home__see-all" onClick={() => navigate('/chat')}>full chat →</button>
            </div>
            <div className="home__chat-preview">
              <div className="home__aryan-tag">
                <span className="home__aryan-dot" />
                Aryan · IIT Bombay
              </div>
              {recentChat.map((msg, i) => (
                <div
                  key={i}
                  className={`home__msg ${msg.role === 'aryan' ? 'home__msg--aryan' : 'home__msg--user'}`}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Log history */}
        {logs.length > 0 && (
          <section className="home__history-section">
            <div className="home__section-label">past weeks</div>
            <div className="home__history">
              {logs.slice().reverse().map((log, i) => (
                <div key={i} className="home__history-item">
                  <div className="home__history-week">week {log.week}</div>
                  <div className="home__history-text">{log.text || log.content}</div>
                  <div className="home__history-date">{log.date}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6)  return 'still up?'
  if (h < 12) return 'good morning,'
  if (h < 17) return 'good afternoon,'
  if (h < 21) return 'good evening,'
  return 'good night,'
}
