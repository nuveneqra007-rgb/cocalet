import { useRef, memo } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import AnimatedCounter from '@/components/AnimatedCounter'
import WaveDivider from '@/components/WaveDivider'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  {
    value: 85,
    suffix: '%',
    label: 'Agua Reciclada',
    color: '#22c55e',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0c0-5-8-13-8-13z" />
      </svg>
    ),
  },
  {
    value: 100,
    suffix: '%',
    label: 'Envases Reciclables',
    color: '#3b82f6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881A1.785 1.785 0 013.4 16.4L11 6M14 16h8M17 16l3 3-3 3M7 16L4 13l3-3" />
        <path d="M13 6h2.185a1.83 1.83 0 011.645 1.009l.03.06A1.785 1.785 0 0116.6 8.6L13 14" />
      </svg>
    ),
  },
  {
    value: 50,
    suffix: '%',
    label: 'Reducción CO₂',
    color: '#F5B042',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    value: 2.5,
    suffix: 'M',
    label: 'Litros Donados',
    color: '#E61D2B',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
]

const chartData = [
  { year: '2020', agua: 60, emisiones: 80, reciclaje: 55 },
  { year: '2021', agua: 68, emisiones: 70, reciclaje: 65 },
  { year: '2022', agua: 75, emisiones: 60, reciclaje: 78 },
  { year: '2023', agua: 80, emisiones: 55, reciclaje: 88 },
  { year: '2024', agua: 85, emisiones: 50, reciclaje: 95 },
  { year: '2025', agua: 92, emisiones: 42, reciclaje: 100 },
]

const commitments = [
  {
    title: 'Mundo Sin Residuos',
    desc: 'Para 2030, recogeremos y reciclaremos el equivalente a cada botella vendida.',
    icon: '♻️',
    color: '#22c55e',
  },
  {
    title: 'Agua para Todos',
    desc: 'Devolvemos el 100% del agua utilizada en nuestras bebidas a las comunidades y la naturaleza.',
    icon: '💧',
    color: '#3b82f6',
  },
  {
    title: 'Huella de Carbono',
    desc: 'Reducción del 25% de emisiones de carbono para 2030 en toda nuestra cadena de valor.',
    icon: '🌍',
    color: '#F5B042',
  },
  {
    title: 'Energía Renovable',
    desc: 'El 100% de nuestra energía proviene de fuentes renovables en nuestras plantas principales.',
    icon: '⚡',
    color: '#a855f7',
  },
]

const Sustainability = memo(function Sustainability() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const liquidFillRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.sustain-title',
        { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out' }
      )

      gsap.fromTo('.sustain-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
      )

      // Liquid fill animation
      if (liquidFillRef.current) {
        gsap.fromTo(liquidFillRef.current,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: liquidFillRef.current,
              start: 'top 80%',
              end: 'top 30%',
              scrub: true,
            },
          }
        )
      }

      // Chart entrance
      gsap.fromTo('.chart-container',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.chart-container',
            start: 'top 80%',
          },
        }
      )

      // Commitments stagger
      gsap.fromTo('.commitment-card',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.commitments-grid',
            start: 'top 80%',
          },
        }
      )

      // Eco message
      gsap.fromTo('.eco-message',
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.eco-message',
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <div ref={sectionRef} className="relative min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-20">
      {/* Green-themed cosmic BG */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 30% 30%, rgba(34,197,94,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(59,130,246,0.05) 0%, transparent 50%)',
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="sustain-title text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-heading text-white mb-3 sm:mb-4">
            COMPROMISO <span className="text-green-400">VERDE</span>
          </h1>
          <p className="sustain-subtitle text-white/50 max-w-2xl mx-auto font-body text-base sm:text-lg">
            Cada gota cuenta. Estamos comprometidos con un futuro donde el sabor
            no le cuesta la Tierra.
          </p>
        </div>

        {/* Animated Counter Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-20">
          {stats.map((stat, i) => (
            <AnimatedCounter
              key={i}
              target={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              color={stat.color}
              icon={stat.icon}
            />
          ))}
        </div>

        <WaveDivider color="rgba(34, 197, 94, 0.08)" />

        {/* Liquid Fill Bottle */}
        <div className="my-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-heading text-white mb-4">
              Cada Botella <span className="text-green-400">Cuenta</span>
            </h2>
            <p className="text-white/50 font-body leading-relaxed mb-6">
              Nuestra meta es que cada envase que producimos vuelva a nosotros.
              Trabajamos con comunidades locales, gobiernos y socios recicladores
              para crear un ciclo completo donde nada se pierde.
            </p>
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-heading text-green-400">12B+</div>
                <div className="text-white/40 text-xs font-body">Botellas recicladas</div>
              </div>
              <div>
                <div className="text-2xl font-heading text-blue-400">200+</div>
                <div className="text-white/40 text-xs font-body">Países participantes</div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 relative w-48 h-72">
            {/* Bottle outline */}
            <svg viewBox="0 0 120 200" className="w-full h-full" fill="none">
              <path
                d="M45 10 L45 30 Q25 40 25 60 L25 170 Q25 185 40 190 L80 190 Q95 185 95 170 L95 60 Q95 40 75 30 L75 10 Z"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
              />
            </svg>
            {/* Liquid fill */}
            <div
              ref={liquidFillRef}
              className="absolute inset-0"
              style={{ clipPath: 'inset(100% 0 0 0)' }}
            >
              <svg viewBox="0 0 120 200" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <path
                  d="M45 10 L45 30 Q25 40 25 60 L25 170 Q25 185 40 190 L80 190 Q95 185 95 170 L95 60 Q95 40 75 30 L75 10 Z"
                  fill="url(#liquidGrad)"
                />
              </svg>
            </div>
          </div>
        </div>

        <WaveDivider color="rgba(59, 130, 246, 0.06)" flip />

        {/* Water Usage Chart */}
        <div className="chart-container my-16">
          <h2 className="text-3xl font-heading text-white text-center mb-2">
            Progreso <span className="text-green-400">Ambiental</span>
          </h2>
          <p className="text-white/40 text-center font-body text-sm mb-8">
            Evolución año a año de nuestras métricas de sostenibilidad
          </p>
          <div className="glass-card rounded-2xl p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="year"
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10,10,10,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontFamily: 'Inter',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="agua" name="Agua Reciclada" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill="#22c55e" fillOpacity={0.5 + (index * 0.08)} />
                  ))}
                </Bar>
                <Bar dataKey="reciclaje" name="Reciclaje" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill="#3b82f6" fillOpacity={0.5 + (index * 0.08)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commitments Grid */}
        <div className="commitments-grid grid grid-cols-1 sm:grid-cols-2 gap-6 my-16">
          {commitments.map((c, i) => (
            <div
              key={i}
              className="commitment-card glass-card rounded-2xl p-6 flex gap-4 group hover:border-white/20 transition-all duration-500"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: `${c.color}15` }}
              >
                {c.icon}
              </div>
              <div>
                <h3 className="text-xl font-heading text-white mb-2">{c.title}</h3>
                <p className="text-white/50 font-body text-sm leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Eco message */}
        <div className="eco-message glass-card rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
          <div className="relative z-10">
            <h3 className="text-3xl sm:text-4xl font-heading text-white mb-4">
              Nuestro Planeta, Nuestra <span className="text-green-400">Prioridad</span>
            </h3>
            <p className="text-white/55 font-body max-w-2xl mx-auto leading-relaxed">
              Estamos comprometidos con un futuro donde cada botella devuelve más de lo que toma.
              Desde envases 100% reciclables hasta programas de conservación de agua,
              estamos construyendo un mundo más refrescante para las próximas generaciones.
            </p>
          </div>
        </div>

        {/* Eco visual */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/15 to-blue-500/15 rounded-full animate-pulse" />
            <img
              src="/images/elements/eco-leaf.png"
              alt="Hoja ecológica"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.3))' }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
})

export default Sustainability