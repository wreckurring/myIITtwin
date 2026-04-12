import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const MOCK_RECENT = [
  {
    role: 'aryan',
    text: "yo welcome! finally someone to talk to 😄 tell me — what semester are you in and what's the goal?",
    time: 'just now',
  },
]

const MOCK_LOG_REPLY =
  "okay that's a solid week actually. graphs are where things start clicking — once you get BFS down, Dijkstra becomes obvious. one thing for this week: do the 'word ladder' problem on LC. just that one. it'll stretch how you think about BFS."

export default function Home() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [logText, setLogText] = useState('')
  const [logs, setLogs] = useState([])
  const [recentChat, setRecentChat] = useState(MOCK_RECENT)
  const [submitting, setSubmitting] = useState(false)
  const [weekCount, setWeekCount] = useState(0)

  useEffect(() => {
    const raw = localStorage.getItem('myiittwin_profile')
    if (!raw) { navigate('/onboarding'); return }
    setProfile(JSON.parse(raw))

    const savedLogs = JSON.parse(localStorage.getItem('myiittwin_logs') || '[]')
    setLogs(savedLogs)
    setWeekCount(savedLogs.length)
  }, [navigate])

  function handleLogSubmit(e) {
    e.preventDefault()
    if (!logText.trim()) return

    setSubmitting(true)

    // Simulate Aryan reacting (mock — will wire to API later)
    setTimeout(() => {
      const newLog = {
        week: weekCount + 1,
        text: logText.trim(),
        aryanReply: MOCK_LOG_REPLY,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      }

      const updated = [...logs, newLog]
      setLogs(updated)
      localStorage.setItem('myiittwin_logs', JSON.stringify(updated))
      setWeekCount(updated.length)

      // Add to recent chat
      setRecentChat([
        { role: 'user', text: logText.trim(), time: 'just now' },
        { role: 'aryan', text: MOCK_LOG_REPLY, time: 'just now' },
      ])

      setLogText('')
      setSubmitting(false)
    }, 1200)
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
        {/* Header */}
        <header className="home__header">
          <div>
            <p className="home__greeting">{greeting}</p>
            <h1 className="home__title serif">{profile.name}</h1>
          </div>
          <div className="home__streak">
            <span className="home__streak-num">{weekCount}</span>
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
            <div className="home__log-footer">
              <span className="home__log-hint">Aryan will react to this</span>
              <button
                type="submit"
                className="home__log-btn"
                disabled={!logText.trim() || submitting}
              >
                {submitting ? (
                  <span className="home__log-loading">
                    <span />
                    <span />
                    <span />
                  </span>
                ) : 'send →'}
              </button>
            </div>
          </form>
        </section>

        {/* Recent chat */}
        <section className="home__chat-section">
          <div className="home__section-label">
            recent
            <button className="home__see-all" onClick={() => navigate('/chat')}>
              see all →
            </button>
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

        {/* Log history strip */}
        {logs.length > 0 && (
          <section className="home__history-section">
            <div className="home__section-label">past weeks</div>
            <div className="home__history">
              {logs.slice().reverse().map((log, i) => (
                <div key={i} className="home__history-item">
                  <div className="home__history-week">week {log.week}</div>
                  <div className="home__history-text">{log.text}</div>
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
