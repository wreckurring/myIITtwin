import { Component } from 'react'
import './ErrorBoundary.css'

export default class ErrorBoundary extends Component {
  state = { crashed: false }

  static getDerivedStateFromError() {
    return { crashed: true }
  }

  render() {
    if (this.state.crashed) {
      return (
        <div className="errb">
          <div className="errb__card">
            <div className="errb__avatar">A</div>
            <h1 className="errb__title">bro something just broke on my end 😭</h1>
            <p className="errb__body">
              no idea what happened — I was literally just sitting here. try reloading and it'll probably be fine.
            </p>
            <button className="errb__btn" onClick={() => window.location.reload()}>
              reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
