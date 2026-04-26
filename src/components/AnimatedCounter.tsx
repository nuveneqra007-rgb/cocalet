import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedCounterProps {
  target: number
  suffix?: string
  label: string
  color?: string
  icon?: React.ReactNode
}

export default function AnimatedCounter({
  target,
  suffix = '',
  label,
  color = '#E61D2B',
  icon,
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    if (!containerRef.current || !valueRef.current || !circleRef.current) return

    const circumference = 2 * Math.PI * 45
    gsap.set(circleRef.current, {
      strokeDasharray: circumference,
      strokeDashoffset: circumference,
    })

    const obj = { val: 0 }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        once: true,
      },
    })

    tl.to(obj, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (valueRef.current) {
          const display = obj.val % 1 === 0 ? Math.round(obj.val) : obj.val.toFixed(1)
          valueRef.current.innerText = display + suffix
        }
      },
    })

    tl.to(
      circleRef.current,
      {
        strokeDashoffset: circumference * (1 - Math.min(target / 100, 1)),
        duration: 2.5,
        ease: 'power2.out',
      },
      0
    )

    return () => {
      tl.kill()
    }
  }, [target, suffix])

  return (
    <div ref={containerRef} className="glass-card p-6 flex flex-col items-center text-center group hover:border-white/20 transition-all duration-500">
      {/* Circular progress ring */}
      <div className="relative w-28 h-28 mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            ref={circleRef}
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {icon && <div className="mb-1 text-white/60">{icon}</div>}
          <div
            ref={valueRef}
            className="text-2xl font-heading"
            style={{ color }}
          >
            0{suffix}
          </div>
        </div>
      </div>
      <div className="text-white/60 text-sm font-body">{label}</div>
    </div>
  )
}
