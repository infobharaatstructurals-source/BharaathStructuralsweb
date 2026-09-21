import { useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Metrics from './components/Metrics/Metrics'
import Capabilities from './components/Capabilities/Capabilities'
import Services from './components/Services/Services'
import Partners from './components/Partners/Partners'
import Contact from './components/Contact/Contact'
import Clients from './components/Clients/Clients'
import Footer from './components/Footer/Footer'






import { useReveal } from './hooks/useReveal'
import { useCounters } from './hooks/useCounters'
import { metrics } from './data/siteData'
import { scrollToId } from './utils/scrollToId'
import './styles/global.css'

function HomePage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const metricValues = useCounters(metrics.map(item => item.value))
  const location = useLocation()

  useEffect(() => {
    // If we just navigated here with a pending section target, scroll to it
    const pendingId = sessionStorage.getItem('scrollTarget')

    if (pendingId) {
      sessionStorage.removeItem('scrollTarget')
      let attempts = 0
      const tryScroll = () => {
        const el = document.getElementById(pendingId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (attempts < 40) {
          attempts++
          requestAnimationFrame(tryScroll)
        }
      }
      tryScroll()
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname])

  return (
    <main>
      <Hero onNavigate={onNavigate} />
      <About onNavigate={onNavigate} />
      <Metrics values={metricValues} />
      <Capabilities />
      <Services onNavigate={onNavigate} />
      <Partners />
      <Contact />
    </main>
  )
}

export default function App() {
  useReveal()
  const navigate = useNavigate()
  const location = useLocation()

  // Single shared navigation handler — used by Navbar AND by
  // Hero/About/Services buttons via onNavigate.
  const go = (id: string) => {
    if (location.pathname !== '/') {
      sessionStorage.setItem('scrollTarget', id)
      navigate('/')
    } else {
      scrollToId(id)
    }
  }

  return (
    <div className="site-shell">
      <Navbar onNavigate={go} />
      <Routes>
        <Route path="/" element={<HomePage onNavigate={go} />} />
        <Route path="/certifications" element={<Clients />} />
      </Routes>
      <Footer />
    </div>
  )
}