import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../services/api'
import './Onboarding.css'

const VIBES = ['Sports', 'Music', 'Gaming', 'Art', 'Movies', 'Reading', 'Just coding']

const STEPS = [
  {
    id: 'name',
    question: "hey! I'm Aryan. what's your name?",
    type: 'text',
    placeholder: 'type your name...',
    validate: v => v.trim().length >= 1,
  },
  {
    id: 'semester',
    question: (name) => `nice to meet you, ${name}. which semester are you in?`,
    type: 'choice',
    options: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
  },
  {
    id: 'career',
    question: "what's the goal — what do you want to become?",
    type: 'choice',
    options: ['Software Engineer', 'Data Scientist', 'Cybersecurity', 'Product Manager'],
  },
  {
    id: 'background',
    question: "tell me where you're at right now — LeetCode count, any projects, skills you know. just be honest.",
    type: 'textarea',
    placeholder: 'e.g. done 30 LC problems, know basic Java and HTML, made a todo app...',
    validate: v => v.trim().length >= 5,
  },
  {
    id: 'vibe',
    question: "what do you do outside of coding? pick whatever fits.",
    type: 'multiselect',
    options: VIBES,
  },
  {
    id: 'goal',
    question: "last thing — what do you actually want to achieve, and roughly by when?",
    type: 'textarea',
    placeholder: 'e.g. SWE internship at a product company by sem 5, or full-time job at 12LPA by graduation...',
    validate: v => v.trim().length >= 5,
  },
]

function useTypewriter(text, speed = 28) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    if (!text) return
    let i = 0
    const iv = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(iv)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(iv)
  }, [text, speed])

  return { displayed, done }
}

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [inputVal, setInputVal] = useState('')
  const [selectedVibes, setSelectedVibes] = useState([])
  const [showInput, setShowInput] = useState(false)
  const [animating, setAnimating] = useState(false)
  const inputRef = useRef(null)

  const current = STEPS[step]
  const questionText = typeof current.question === 'function'
    ? current.question(answers.name || '')
    : current.question

  const { displayed, done } = useTypewriter(questionText, 22)

  useEffect(() => {
    if (done) {
      setTimeout(() => setShowInput(true), 180)
    } else {
      setShowInput(false)
    }
  }, [done])

  useEffect(() => {
    if (showInput && inputRef.current && current.type !== 'choice' && current.type !== 'multiselect') {
      inputRef.current.focus()
    }
  }, [showInput, current.type])

  // Reset input when step changes
  useEffect(() => {
    setInputVal('')
    setSelectedVibes([])
  }, [step])

  function canProceed() {
    if (current.type === 'choice') return false // choices auto-advance
    if (current.type === 'multiselect') return selectedVibes.length > 0
    if (current.validate) return current.validate(inputVal)
    return inputVal.trim().length > 0
  }

  async function advance(value) {
    const newAnswers = { ...answers, [current.id]: value }
    setAnswers(newAnswers)

    if (step < STEPS.length - 1) {
      setAnimating(true)
      setTimeout(() => {
        setStep(s => s + 1)
        setAnimating(false)
      }, 300)
    } else {
      // Done — POST to backend, save userId + profile to localStorage
      try {
        const userData = await createUser({
          name: newAnswers.name,
          semester: newAnswers.semester,
          career: newAnswers.career,
          background: newAnswers.background,
          vibe: Array.isArray(newAnswers.vibe) ? newAnswers.vibe : [newAnswers.vibe],
          goal: newAnswers.goal,
        })
        localStorage.setItem('myiittwin_userId', userData.userId)
        localStorage.setItem('myiittwin_profile', JSON.stringify(userData))
        navigate('/home')
      } catch (err) {
        console.error('Onboarding error:', err)
        // Fallback: save locally and continue
        localStorage.setItem('myiittwin_profile', JSON.stringify(newAnswers))
        navigate('/home')
      }
    }
  }

  function handleChoice(option) {
    advance(option)
  }

  function handleVibeToggle(vibe) {
    setSelectedVibes(prev =>
      prev.includes(vibe) ? prev.filter(v => v !== vibe) : [...prev, vibe]
    )
  }

  function handleSubmit(e) {
    e?.preventDefault()
    if (!canProceed()) return
    const value = current.type === 'multiselect' ? selectedVibes : inputVal
    advance(value)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && current.type !== 'textarea') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const progress = ((step) / STEPS.length) * 100

  return (
    <div className="onboarding">
      {/* Progress bar */}
      <div className="ob__progress">
        <div className="ob__progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="ob__inner">
        {/* Aryan label */}
        <div className="ob__who">
          <span className="ob__dot" />
          <span>Aryan · IIT Bombay</span>
        </div>

        {/* Question */}
        <div className={`ob__question ${animating ? 'ob__question--out' : ''}`}>
          <p className="ob__q-text serif">
            {displayed}
            {!done && <span className="ob__cursor">|</span>}
          </p>
        </div>

        {/* Input area */}
        {showInput && !animating && (
          <form className={`ob__answer fade-up`} onSubmit={handleSubmit}>

            {current.type === 'text' && (
              <div className="ob__input-wrap">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={current.placeholder}
                  autoComplete="off"
                  className="ob__input"
                />
                {inputVal.trim() && (
                  <button type="submit" className="ob__send">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>
            )}

            {current.type === 'textarea' && (
              <div className="ob__textarea-wrap">
                <textarea
                  ref={inputRef}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder={current.placeholder}
                  rows={3}
                  className="ob__textarea"
                />
                <div className="ob__textarea-footer">
                  <span className="ob__hint">shift+enter for new line</span>
                  <button
                    type="submit"
                    className="ob__btn"
                    disabled={!canProceed()}
                  >
                    continue →
                  </button>
                </div>
              </div>
            )}

            {current.type === 'choice' && (
              <div className="ob__choices">
                {current.options.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    className="ob__choice"
                    onClick={() => handleChoice(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {current.type === 'multiselect' && (
              <div className="ob__multiselect">
                <div className="ob__vibes">
                  {VIBES.map(vibe => (
                    <button
                      key={vibe}
                      type="button"
                      className={`ob__vibe ${selectedVibes.includes(vibe) ? 'ob__vibe--on' : ''}`}
                      onClick={() => handleVibeToggle(vibe)}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
                {selectedVibes.length > 0 && (
                  <button type="submit" className="ob__btn ob__btn--full fade-up">
                    looks good →
                  </button>
                )}
              </div>
            )}

          </form>
        )}

        {/* Step counter */}
        <div className="ob__counter">
          {step + 1} / {STEPS.length}
        </div>
      </div>
    </div>
  )
}
