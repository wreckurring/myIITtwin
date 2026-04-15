import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Landing />} />
        <Route path="/onboarding"  element={<Onboarding />} />
        <Route path="/home"        element={<Home />} />
        <Route path="/chat"        element={<Chat />} />
        <Route path="*"            element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
