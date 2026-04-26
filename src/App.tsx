import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation'
import BubbleParticles from './components/BubbleParticles'
import Loader3D from './components/loader/Loader3D'
import LiquidTransitionProvider from './components/layout/LiquidTransition'

// Code Splitting - Lazy load pages for much faster initial bundle size
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const History = lazy(() => import('./pages/History'))
const Sustainability = lazy(() => import('./pages/Sustainability'))
const FlavorCreator = lazy(() => import('./pages/FlavorCreator'))
const Contact = lazy(() => import('./pages/Contact'))

gsap.registerPlugin(ScrollTrigger)

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' }) // changed to instant to prevent weird jumps
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
      {/* Canvas particle system, decoupled from React state */}
      <BubbleParticles />
      
      {isLoading ? (
        <Loader3D onComplete={handleLoaderComplete} />
      ) : null}
      
      <LiquidTransitionProvider>
        <ScrollToTop />
        {!isLoading && <Navigation />}
        <main className="relative z-10">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-coke-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/historia" element={<History />} />
              <Route path="/sostenibilidad" element={<Sustainability />} />
              <Route path="/crea-tu-coca" element={<FlavorCreator />} />
              <Route path="/contacto" element={<Contact />} />
            </Routes>
          </Suspense>
        </main>
      </LiquidTransitionProvider>
    </div>
  )
}

export default function App() {
  return <AppContent />
}