import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation'
import BubbleParticles from './components/BubbleParticles'
import Loader3D from './components/loader/Loader3D'
import LiquidTransitionProvider from './components/layout/LiquidTransition'
import Home from './pages/Home'
import Products from './pages/Products'
import History from './pages/History'
import Sustainability from './pages/Sustainability'
import FlavorCreator from './pages/FlavorCreator'
import Contact from './pages/Contact'

gsap.registerPlugin(ScrollTrigger)

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Refresh ScrollTrigger after route change
    setTimeout(() => ScrollTrigger.refresh(), 100)
  }, [pathname])

  return null
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoaderComplete = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative min-h-screen bg-coke-dark overflow-x-hidden">
      <BubbleParticles />
      {isLoading ? (
        <Loader3D onComplete={handleLoaderComplete} />
      ) : null}
      <LiquidTransitionProvider>
        <ScrollToTop />
        {!isLoading && <Navigation />}
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/historia" element={<History />} />
            <Route path="/sostenibilidad" element={<Sustainability />} />
            <Route path="/crea-tu-coca" element={<FlavorCreator />} />
            <Route path="/contacto" element={<Contact />} />
          </Routes>
        </main>
      </LiquidTransitionProvider>
    </div>
  )
}

export default function App() {
  return <AppContent />
}