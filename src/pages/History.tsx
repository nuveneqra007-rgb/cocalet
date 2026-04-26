import { useRef, memo } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

const timelineEvents = [
  {
    year: '1886',
    title: 'El Invento',
    desc: 'El farmacéutico John Pemberton crea la fórmula original en Atlanta, Georgia. Una mezcla secreta que cambiaría el mundo para siempre.',
    icon: 'flask',
    color: '#F5B042',
  },
  {
    year: '1899',
    title: 'Botella Contour',
    desc: 'Se diseña la icónica botella de contorno, tan reconocible que puede identificarse en la oscuridad o incluso rota en pedazos.',
    icon: 'bottle',
    color: '#E61D2B',
  },
  {
    year: '1931',
    title: 'Santa en Rojo',
    desc: 'Haddon Sundblom pinta al Santa Claus moderno vestido de rojo. La cultura popular jamás volvería a ser la misma.',
    icon: 'santa',
    color: '#DC2626',
  },
  {
    year: '1971',
    title: 'Hilltop',
    desc: 'El legendario comercial "I\'d Like to Buy the World a Coke" conecta al planeta entero bajo un mensaje de unidad.',
    icon: 'world',
    color: '#3B82F6',
  },
  {
    year: '1985',
    title: 'New Coke',
    desc: 'Un cambio audaz de fórmula que provocó una revolución. La reacción del público demostró el poder emocional del sabor original.',
    icon: 'can',
    color: '#C0C0C0',
  },
  {
    year: '2025',
    title: 'COKELAB',
    desc: 'Nace la evolución definitiva: una experiencia inmersiva, sostenible y futurista que redefine lo que significa refrescar el mundo.',
    icon: 'future',
    color: '#FF2A3B',
  },
]

const History = memo(function History() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Title entrance — liquid reveal
      gsap.fromTo('.history-title',
        { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out' }
      )

      gsap.fromTo('.history-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
      )

      // Hero glow
      gsap.fromTo('.history-hero-glow',
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power3.out' }
      )

      // Timeline progress bar scrub
      if (progressRef.current) {
        gsap.fromTo(progressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 70%',
              end: 'bottom 30%',
              scrub: true,
            },
          }
        )
      }

      // Timeline items
      const items = timelineRef.current?.querySelectorAll('.timeline-item')
      items?.forEach((item, i) => {
        const isLeft = i % 2 === 0
        gsap.fromTo(item,
          { opacity: 0, x: isLeft ? -40 : 40 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 82%',
            },
          }
        )

        // Year bounce
        const yearEl = item.querySelector('.timeline-year')
        if (yearEl) {
          gsap.fromTo(yearEl,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.8,
              ease: 'elastic.out(1, 0.4)',
              scrollTrigger: {
                trigger: item,
                start: 'top 78%',
              },
            }
          )
        }

        // Pulse ring
        const pulseEl = item.querySelector('.pulse-ring-el')
        if (pulseEl) {
          gsap.fromTo(pulseEl,
            { scale: 0.6, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              scrollTrigger: {
                trigger: item,
                start: 'top 78%',
              },
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, { scope: sectionRef })

  const getIcon = (icon: string): React.ReactNode => {
    const icons: Record<string, React.ReactNode> = {
      flask: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 3h6M10 3v7l-4 8v2h12v-2l-4-8V3" /><path d="M12 12v.01" />
        </svg>
      ),
      bottle: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 2h6M10 2v4l-3 3v9a2 2 0 002 2h4a2 2 0 002-2V9l-3-3V2" />
        </svg>
      ),
      santa: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" /><path d="M12 12v4M8 20h8M6 16h12" />
        </svg>
      ),
      world: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 004 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 004-10z" />
        </svg>
      ),
      can: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 2h10M8 2v18a2 2 0 002 2h4a2 2 0 002-2V2" /><path d="M6 6h12M6 18h12" />
        </svg>
      ),
      future: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    }
    return icons[icon] || icons.flask
  }

  return (
    <div ref={sectionRef} className="relative min-h-screen pt-28 pb-20">
      {/* Cosmic BG */}
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="relative text-center mb-12 sm:mb-20">
          <div className="history-hero-glow absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full bg-coke-gold/10 blur-[80px]" />
          </div>
          <h1 className="history-title text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-heading text-white mb-3 sm:mb-4">
            HISTORIA <span className="text-gradient-gold">LÍQUIDA</span>
          </h1>
          <p className="history-subtitle text-white/50 max-w-2xl mx-auto font-body text-base sm:text-lg">
            Un viaje a través del tiempo, donde cada gota cuenta una historia de innovación,
            pasión y el sabor que unió al mundo.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Central line (desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/10 -translate-x-1/2 hidden lg:block" />
          {/* Animated progress overlay */}
          <div
            ref={progressRef}
            className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-coke-gold via-coke-red to-coke-neon -translate-x-1/2 hidden lg:block origin-top"
            style={{ transform: 'scaleY(0)' }}
          />

          {/* Mobile left line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10 lg:hidden" />

          <div className="space-y-12 lg:space-y-20">
            {timelineEvents.map((event, i) => {
              const isLeft = i % 2 === 0
              return (
                <div
                  key={event.year}
                  className={`timeline-item relative flex items-start gap-6 lg:gap-0 ${
                    isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                  style={{ perspective: '800px' }}
                >
                  {/* Card */}
                  <div
                    className={`flex-1 ml-14 lg:ml-0 ${
                      isLeft ? 'lg:text-right lg:pr-16' : 'lg:text-left lg:pl-16'
                    }`}
                  >
                    <div className="glass-card rounded-2xl p-6 inline-block max-w-md group hover:border-white/20 transition-all duration-500">
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'lg:justify-end' : ''}`}>
                        <span style={{ color: event.color }}>{getIcon(event.icon)}</span>
                        <h3 className="text-2xl font-heading text-white">{event.title}</h3>
                      </div>
                      <p className="text-white/55 font-body text-sm leading-relaxed">
                        {event.desc}
                      </p>
                    </div>
                  </div>

                  {/* Center node */}
                  <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 z-10 flex flex-col items-center">
                    {/* Pulse effect */}
                    <div
                      className="pulse-ring-el absolute w-14 h-14 rounded-full pulse-ring"
                      style={{ backgroundColor: `${event.color}20`, border: `1px solid ${event.color}40` }}
                    />
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center relative"
                      style={{
                        background: `linear-gradient(135deg, ${event.color}, ${event.color}CC)`,
                        boxShadow: `0 0 30px ${event.color}60`,
                      }}
                    >
                      <span className="timeline-year text-sm font-heading text-white font-bold">
                        {event.year}
                      </span>
                    </div>
                  </div>

                  {/* Empty space for the other side */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Closing section */}
        <div className="mt-24 text-center">
          <div className="section-line mb-12" />
          <div className="relative inline-block">
            <img
              src="/images/elements/vintage-bottle.png"
              alt="Botella vintage Coca-Cola"
              className="w-40 mx-auto opacity-50 hover:opacity-100 transition-opacity duration-700"
              style={{ filter: 'drop-shadow(0 0 40px rgba(245, 176, 66, 0.4))' }}
            />
          </div>
          <p className="mt-6 text-white/30 font-body text-sm">
            Más de 130 años refrescando el mundo
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
})

export default History