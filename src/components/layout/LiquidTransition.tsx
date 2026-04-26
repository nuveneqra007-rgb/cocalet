import { useRef, useCallback, createContext, useContext } from 'react'
import { useNavigate } from 'react-router'
import gsap from 'gsap'

interface LiquidTransitionContextType {
  navigateWithTransition: (path: string) => void
}

const LiquidTransitionContext = createContext<LiquidTransitionContextType | null>(null)

export function useLiquidTransition() {
  const context = useContext(LiquidTransitionContext)
  if (!context) {
    throw new Error('useLiquidTransition must be used within LiquidTransitionProvider')
  }
  return context
}

export default function LiquidTransitionProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const navigateWithTransition = useCallback((path: string) => {
    if (!containerRef.current) {
      navigate(path)
      return
    }

    const tl = gsap.timeline()

    tl.to(containerRef.current, {
      clipPath: 'circle(150% at 50% 50%)',
      duration: 0.5,
      ease: 'power2.inOut',
    })
    .to(containerRef.current, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        navigate(path)
        gsap.set(containerRef.current, { opacity: 1 })
      },
    })
    .to(containerRef.current, {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 0.5,
      ease: 'power2.inOut',
    })
  }, [navigate])

  return (
    <LiquidTransitionContext.Provider value={{ navigateWithTransition }}>
      {children}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9990] pointer-events-none bg-coke-red"
        style={{ clipPath: 'circle(0% at 50% 50%)' }}
      />
    </LiquidTransitionContext.Provider>
  )
}