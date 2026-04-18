import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getChatHistory, sendChatMessage } from '../services/api'
import { SkeletonBubble } from '../components/Skeleton'
import BottomNav from '../components/BottomNav'
import './Chat.css'

const FREE_LIMIT = 10

export default function Chat() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [userId, setUserId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError] = useState(null)
  const [msgCount, setMsgCount] = useState(() =>
    parseInt(localStorage.getItem('myiittwin_msg_count') || '0', 10)
  )
  const [userKey, setUserKey] = useState(() =>
    localStorage.getItem('myiittwin_gemini_key') || ''
  )
  const [keyInput, setKeyInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const limitReached = !userKey && msgCount >= FREE_LIMIT

  function resetApp() {
    if (!window.confirm('Start over? This clears your profile, chat history, and all logs.')) return
    ;['myiittwin_profile', 'myiittwin_userId', 'myiittwin_logs',
      'myiittwin_msg_count', 'myiittwin_gemini_key'].forEach(k => localStorage.removeItem(k))
    navigate('/onboarding')
  }

  useEffect(() => {
    const raw = localStorage.getItem('myiittwin_profile')
    const uid = localStorage.getItem('myiittwin_userId')
    if (!raw) { navigate('/onboarding'); return }
    const p = JSON.parse(raw)
    setProfile(p)
    const id = uid || p.userId
    setUserId(id)

    if (id) {
      setHistoryLoading(true)
      getChatHistory(id)
        .then(history => setMessages(history))
        .catch(() => {
          // Fallback greeting if backend is down
          setMessages([{
            role: 'aryan',
            text: `hey ${p.name}! just settled in after a long lab session 😅 what's up — anything specific you wanna know, or just catching up?`,
            time: now(),
          }])
        })
        .finally(() => setHistoryLoading(false))
    }
  }, [navigate])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.style.height = 'auto'
    inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
  }, [input])

  function saveUserKey() {
    const trimmed = keyInput.trim()
    if (!trimmed) return
    localStorage.setItem('myiittwin_gemini_key', trimmed)
    setUserKey(trimmed)
    setKeyInput('')
  }

  async function send(e) {
    e?.preventDefault()
    if (!input.trim() || typing || !userId || limitReached) return

    const userMsg = { role: 'user', text: input.trim(), time: now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)
    setError(null)

    try {
      const reply = await sendChatMessage(userId, userMsg.text)
      setMessages(prev => [...prev, { role: reply.role, text: reply.text, time: reply.time || now() }])
      // Only count toward free limit when using server key
      if (!userKey) {
        const next = msgCount + 1
        setMsgCount(next)
        localStorage.setItem('myiittwin_msg_count', String(next))
      }
    } catch (err) {
      setError(err.message)
      setMessages(prev => [...prev, {
        role: 'aryan',
        text: err.message.includes('Rate limit') ? err.message : "bro my connection dropped 😭 try again?",
        time: now(),
      }])
    } finally {
      setTyping(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const SUGGESTIONS = [
    "what are you doing this week?",
    "what did you do in sem 2?",
    "what's your plan before internship season?",
    "be honest — how far behind am I?",
  ]

  return (
    <div className="chat">
      {/* Sidebar */}
      <aside className="chat__sidebar">
        <div className="chat__logo">my<span className="accent">IIT</span>twin</div>

        <nav className="chat__nav">
          <button className="chat__nav-item" onClick={() => navigate('/home')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            Home
          </button>
          <button className="chat__nav-item chat__nav-item--active">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 10.667A1.333 1.333 0 0112.667 12H4.667L2 14.667V3.333A1.333 1.333 0 013.333 2h9.334A1.333 1.333 0 0114 3.333v7.334z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Chat with Aryan
          </button>
        </nav>

        <div className="chat__suggestions">
          <div className="chat__suggestions-label">ask aryan</div>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="chat__suggestion"
              onClick={() => { setInput(s); inputRef.current?.focus() }}>
              {s}
            </button>
          ))}
        </div>

        {profile && (
          <div className="chat__sidebar-footer">
            <div className="chat__profile-chip">
              <div className="chat__avatar">{profile.name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="chat__profile-name">{profile.name}</div>
                <div className="chat__profile-meta">{profile.semester}</div>
              </div>
            </div>
            <button className="chat__reset-btn" onClick={resetApp}>start over</button>
          </div>
        )}
      </aside>

      {/* Chat area */}
      <div className="chat__area">
        <header className="chat__header">
          <div className="chat__header-info">
            <div className="chat__header-dot" />
            <div>
              <div className="chat__header-name">Aryan</div>
              <div className="chat__header-sub">CSE · IIT Bombay · {profile?.semester || 'Sem 4'}</div>
            </div>
          </div>
        </header>

        <div className="chat__messages">
          {historyLoading ? (
            <>
              <SkeletonBubble align="left" />
              <SkeletonBubble align="right" />
              <SkeletonBubble align="left" />
            </>
          ) : messages.map((msg, i) => (
            <div key={i} className={`chat__msg-row ${msg.role === 'user' ? 'chat__msg-row--user' : ''}`}>
              {msg.role === 'aryan' && <div className="chat__aryan-avatar">A</div>}
              <div className={`chat__bubble ${msg.role === 'aryan' ? 'chat__bubble--aryan' : 'chat__bubble--user'}`}>
                <p>{msg.text}</p>
                <span className="chat__time">{msg.time}</span>
              </div>
            </div>
          ))}

          {typing && (
            <div className="chat__msg-row">
              <div className="chat__aryan-avatar">A</div>
              <div className="chat__bubble chat__bubble--aryan chat__bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {limitReached && (
          <div className="chat__byok">
            <div className="chat__byok-head">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <rect x="2" y="7" width="11" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 7V4.5a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span>you've used your {FREE_LIMIT} free messages</span>
            </div>
            <p className="chat__byok-safety">
              add your Gemini API key to keep chatting — it's stored only in your browser and never sent to our servers.
            </p>
            <div className="chat__byok-input-row">
              <input
                className="chat__byok-input"
                type="password"
                placeholder="AIza..."
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveUserKey()}
              />
              <button className="chat__byok-save" onClick={saveUserKey} disabled={!keyInput.trim()}>
                save
              </button>
            </div>
          </div>
        )}

        <form className="chat__input-area" onSubmit={send}>
          <div className="chat__input-wrap">
            <textarea
              ref={inputRef}
              className="chat__input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={limitReached ? "add your API key above to keep chatting" : "message Aryan..."}
              rows={1}
              style={{ overflowY: 'hidden' }}
              disabled={typing || limitReached}
            />
            <button type="submit"
              className={`chat__send ${input.trim() && !limitReached ? 'chat__send--active' : ''}`}
              disabled={!input.trim() || typing || limitReached}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M16 9L2 2l3 7-3 7 14-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className="chat__input-hint">enter to send · shift+enter for new line</p>
        </form>
      </div>
      <BottomNav />
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}
