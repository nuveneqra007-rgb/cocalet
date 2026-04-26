import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface SplashTransitionProps {
  active: boolean
}

export default function SplashTransition({ active }: SplashTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!overlayRef.current || !active) return

    const tl = gsap.timeline()
    tl.set(overlayRef.current, { clipPath: 'circle(0% at 50% 50%)', display: 'flex' })
      .to(overlayRef.current, {
        clipPath: 'circle(150% at 50% 50%)',
        duration: 0.7,
        ease: 'power2.inOut',
      })
      .to(overlayRef.current, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.7,
        ease: 'power2.inOut',
        delay: 0.1,
      })
      .set(overlayRef.current, { display: 'none' })
  }, [active])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] hidden items-center justify-center bg-coke-red pointer-events-none"
    >
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120" className="animate-spin" style={{ animationDuration: '1s' }}>
          <circle cx="60" cy="60" r="50" stroke="white" strokeWidth="3" fill="none" strokeDasharray="80 200" strokeLinecap="round"/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 5C20 5 8 12 8 22C8 28 13 33 20 33C27 33 32 28 32 22C32 12 20 5 20 5Z" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
