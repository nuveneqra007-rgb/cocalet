import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface LoaderProps {
  onComplete: () => void
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottleRef = useRef<SVGSVGElement>(null)
  const liquidRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !bottleRef.current || !liquidRef.current || !progressRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete,
        })
      },
    })

    // Draw bottle stroke
    const bottlePath = bottleRef.current.querySelector('.bottle-outline')
    if (bottlePath) {
      const pathLength = (bottlePath as SVGPathElement).getTotalLength?.() || 300
      gsap.set(bottlePath, { strokeDasharray: pathLength, strokeDashoffset: pathLength })
      tl.to(bottlePath, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' })
    }

    // Fill liquid
    tl.to(liquidRef.current, { scaleY: 1, duration: 1.2, ease: 'power2.inOut' }, '-=0.5')

    // Progress bar
    tl.to(progressRef.current, { scaleX: 1, duration: 1, ease: 'power2.out' }, '-=1')

    // Bubbles
    const bubbles = bottleRef.current.querySelectorAll('.loader-bubble')
    tl.fromTo(
      bubbles,
      { y: 20, opacity: 0 },
      { y: -30, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power1.out' },
      '-=0.8'
    )

    // Pulse at end
    tl.to(bottleRef.current, { scale: 1.1, duration: 0.3, ease: 'power2.out' })
    tl.to(bottleRef.current, { scale: 1, duration: 0.3, ease: 'power2.in' })

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-coke-dark"
    >
      <div className="relative w-48 h-64 flex items-center justify-center">
        <svg ref={bottleRef} width="160" height="220" viewBox="0 0 160 220" fill="none" className="relative z-10">
          {/* Bottle outline */}
          <path
            className="bottle-outline"
            d="M80 10 C80 10 55 25 55 50 L55 70 C55 85 35 95 30 120 L30 170 C30 195 50 210 80 210 C110 210 130 195 130 170 L130 120 C125 95 105 85 105 70 L105 50 C105 25 80 10 80 10Z"
            stroke="#E61D2B"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Liquid fill (clip inside bottle) */}
          <defs>
            <clipPath id="bottleClip">
              <path d="M80 10 C80 10 55 25 55 50 L55 70 C55 85 35 95 30 120 L30 170 C30 195 50 210 80 210 C110 210 130 195 130 170 L130 120 C125 95 105 85 105 70 L105 50 C105 25 80 10 80 10Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#bottleClip)">
            <rect x="20" y="220" width="120" height="200" fill="#E61D2B" opacity="0.8" className="liquid-rect" />
          </g>
          {/* Bubbles */}
          <circle className="loader-bubble" cx="60" cy="180" r="3" fill="#FF2A3B" opacity="0" />
          <circle className="loader-bubble" cx="80" cy="160" r="2" fill="#FF2A3B" opacity="0" />
          <circle className="loader-bubble" cx="100" cy="190" r="2.5" fill="#FF2A3B" opacity="0" />
          <circle className="loader-bubble" cx="70" cy="140" r="2" fill="#FF2A3B" opacity="0" />
          <circle className="loader-bubble" cx="90" cy="170" r="3" fill="#FF2A3B" opacity="0" />
        </svg>

        {/* Liquid fill overlay */}
        <div
          ref={liquidRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[100px] h-[180px] origin-bottom"
          style={{ transform: 'scaleY(0)', clipPath: 'url(#bottleClip)' }}
        >
          <div className="w-full h-full bg-gradient-to-t from-coke-red to-coke-neon opacity-60 rounded-b-full" />
        </div>
      </div>

      <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div ref={progressRef} className="h-full bg-gradient-to-r from-coke-red to-coke-neon origin-left" style={{ transform: 'scaleX(0)' }} />
      </div>

      <p className="mt-4 text-white/50 text-sm font-body tracking-widest uppercase">Preparando la experiencia...</p>
    </div>
  )
}
