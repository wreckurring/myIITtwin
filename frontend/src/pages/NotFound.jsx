import { useNavigate } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="nf">
      <div className="nf__glow" />

      <div className="nf__inner">
        <div className="nf__code mono">404</div>

        <h1 className="nf__headline serif">
          this page doesn't exist bro
        </h1>

        <p className="nf__sub">
          aryan checked and he's pretty sure you just typed the wrong URL 💀
        </p>

        <div className="nf__actions">
          <button className="nf__btn" onClick={() => navigate('/')}>
            back to home
          </button>
          <button className="nf__btn nf__btn--ghost" onClick={() => navigate(-1)}>
            go back
          </button>
        </div>
      </div>
    </div>
  )
}
