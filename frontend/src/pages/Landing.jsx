import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Landing.css'

const WORDS = ['IIT Bombay.', 'IIT Delhi.', 'IIT Madras.', 'IIT Kharagpur.']

export default function Landing() {
  const navigate = useNavigate()
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % WORDS.length)
        setVisible(true)
      }, 400)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="landing">
      {/* Ambient glow */}
      <div className="landing__glow" />

      <nav className="landing__nav">
        <span className="landing__logo">my<span className="accent">IIT</span>twin</span>
      </nav>

      <main className="landing__main">
        <div className="landing__eyebrow fade-up">for tier 3 CS students</div>

        <h1 className="landing__headline">
          Meet the student you<br />
          would've been at{' '}
          <span className={`landing__iit ${visible ? 'landing__iit--visible' : ''}`}>
            {WORDS[wordIndex]}
          </span>
        </h1>

        <p className="landing__sub fade-up" style={{ animationDelay: '0.15s' }}>
          Aryan is your IIT batchmate. He has a real life — DSA, projects,<br />
          cricket, hostel chaos. Ask him anything. He reacts to your week.
        </p>

        <div className="landing__actions fade-up" style={{ animationDelay: '0.25s' }}>
          <button
            className="landing__cta"
            onClick={() => navigate('/onboarding')}
          >
            Meet Aryan
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="landing__hint">no signup · free to try</span>
        </div>

        {/* Preview card */}
        <div className="landing__preview fade-up" style={{ animationDelay: '0.4s' }}>
          <div className="preview__label">
            <span className="preview__dot" />
            Aryan · IIT Bombay CSE · Sem 4
          </div>
          <div className="preview__bubble">
            <p>
              "yo so this week I finally started graphs properly — BFS clicked after I did
              the number of islands problem. been avoiding it for like 3 weeks lol 😭
              what'd you get done?"
            </p>
          </div>
          <div className="preview__user">
            <p>learned BFS this week, solved 8 problems</p>
          </div>
          <div className="preview__bubble">
            <p>
              okay that's actually solid for one week. BFS + 8 problems — if you do
              DFS next and then try a combo problem you'll start seeing the pattern.
              <span className="accent"> one thing</span>: do the word ladder problem tonight,
              just that one.
            </p>
          </div>
        </div>
      </main>

      <footer className="landing__footer">
        <span>built by a tier 3 student, for tier 3 students</span>
      </footer>
    </div>
  )
}
