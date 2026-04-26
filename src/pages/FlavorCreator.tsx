import { useEffect, useRef, useState, memo } from 'react'
import gsap from 'gsap'
import Footer from '@/components/Footer'

const flavors = [
  { id: 'cherry', name: 'Cereza', color: '#DC2626', icon: '🍒', desc: 'Dulce y explosiva' },
  { id: 'vanilla', name: 'Vainilla', color: '#F5DEB3', icon: '🍦', desc: 'Suave y cremosa' },
  { id: 'lime', name: 'Lima', color: '#84CC16', icon: '🍋', desc: 'Cítrica y fresca' },
  { id: 'orange', name: 'Naranja', color: '#F97316', icon: '🍊', desc: 'Tropical y vibrante' },
  { id: 'caramel', name: 'Caramelo', color: '#92400E', icon: '🍮', desc: 'Rica y dorada' },
  { id: 'mint', name: 'Menta', color: '#14B8A6', icon: '🌿', desc: 'Helada y refrescante' },
  { id: 'berry', name: 'Frutos Rojos', color: '#9333EA', icon: '🫐', desc: 'Frutal y oscura' },
  { id: 'cinnamon', name: 'Canela', color: '#B45309', icon: '🌶️', desc: 'Cálida y especiada' },
]

const confettiParticles = [...Array(24)].map((_, i) => ({
  left: `${10 + (i * 4 + 3) % 80}%`,
  color: ['#E61D2B', '#F5B042', '#22c55e', '#3b82f6', '#9333EA', '#FF2A3B'][i % 6],
  size: Math.random() * 8 + 4,
  angle: Math.random() * 360,
}))

const FlavorCreator = memo(function FlavorCreator() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canRef = useRef<HTMLDivElement>(null)
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [customName, setCustomName] = useState('')
  const [isBottling, setIsBottling] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Blend the selected colors
  const blendedColor = (() => {
    if (selectedFlavors.length === 0) return '#E61D2B'
    const selected = selectedFlavors.map(id => flavors.find(f => f.id === id)!)
    const r = Math.round(selected.reduce((s, f) => s + parseInt(f.color.slice(1, 3), 16), 0) / selected.length)
    const g = Math.round(selected.reduce((s, f) => s + parseInt(f.color.slice(3, 5), 16), 0) / selected.length)
    const b = Math.round(selected.reduce((s, f) => s + parseInt(f.color.slice(5, 7), 16), 0) / selected.length)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  })()

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.creator-title', { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out' })
      gsap.fromTo('.creator-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' })
      gsap.fromTo('.flavor-drop',
        { opacity: 0, scale: 0, rotateZ: -10 },
        { opacity: 1, scale: 1, rotateZ: 0, duration: 0.5, stagger: 0.06, ease: 'back.out(1.7)', delay: 0.3 }
      )
      gsap.fromTo('.can-preview', { opacity: 0, x: 50, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.5 })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleFlavorClick = (flavorId: string) => {
    if (selectedFlavors.includes(flavorId)) {
      setSelectedFlavors(prev => prev.filter(f => f !== flavorId))
      gsap.fromTo(canRef.current, { scale: 0.97 }, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' })
    } else {
      if (selectedFlavors.length < 3) {
        setSelectedFlavors(prev => [...prev, flavorId])

        // Animate drop hitting can
        gsap.fromTo(canRef.current,
          { scale: 0.92, rotateZ: -2 },
          { scale: 1, rotateZ: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' }
        )
      }
    }
  }

  const handleBottle = () => {
    if (selectedFlavors.length === 0) return
    setIsBottling(true)

    const tl = gsap.timeline({
      onComplete: () => {
        setIsBottling(false)
        setShowSuccess(true)
      },
    })

    // Shake animation
    tl.to(canRef.current, { rotateZ: -3, duration: 0.1, ease: 'power2.out' })
      .to(canRef.current, { rotateZ: 3, duration: 0.1, ease: 'power2.out' })
      .to(canRef.current, { rotateZ: -2, duration: 0.1, ease: 'power2.out' })
      .to(canRef.current, { rotateZ: 2, duration: 0.1, ease: 'power2.out' })
      .to(canRef.current, { rotateZ: 0, scale: 1.15, duration: 0.3, ease: 'power2.out' })
      .to(canRef.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' })

    // Confetti explosion
    const particles = sectionRef.current?.querySelectorAll('.confetti-particle')
    if (particles) {
      particles.forEach((p, i) => {
        const angle = (i / particles.length) * Math.PI * 2
        const distance = 100 + Math.random() * 150
        gsap.fromTo(p,
          { opacity: 0, scale: 0, x: 0, y: 0 },
          {
            opacity: 1,
            scale: 1,
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance - 80,
            duration: 0.8,
            delay: 0.3 + i * 0.02,
            ease: 'power2.out',
          }
        )
        gsap.to(p, {
          opacity: 0,
          scale: 0,
          duration: 0.5,
          delay: 0.9 + i * 0.02,
        })
      })
    }
  }

  const handleReset = () => {
    setShowSuccess(false)
    setSelectedFlavors([])
    setCustomName('')
  }

  const displayName = customName.trim() || 'CUSTOM'

  return (
    <div ref={sectionRef} className="relative min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-20">
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="creator-title text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-heading text-white text-center mb-3 sm:mb-4">
          CREA TU <span className="text-coke-neon">SABOR</span>
        </h1>
        <p className="creator-subtitle text-white/50 text-center mb-10 sm:mb-16 max-w-2xl mx-auto font-body text-base sm:text-lg">
          Sé el alquimista de tu propia experiencia. Mezcla hasta 3 sabores y crea una bebida única en el universo.
        </p>

        {!showSuccess ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            {/* Flavor selection */}
            <div>
              <h3 className="text-2xl font-heading text-white mb-2">Ingredientes</h3>
              <p className="text-white/30 text-sm font-body mb-6">Selecciona hasta 3 sabores</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {flavors.map((flavor) => {
                  const isSelected = selectedFlavors.includes(flavor.id)
                  return (
                    <button
                      key={flavor.id}
                      onClick={() => handleFlavorClick(flavor.id)}
                      className={`flavor-drop glass-card rounded-2xl p-3 sm:p-4 text-center transition-all duration-300 tap-target ${
                        isSelected
                          ? 'ring-2 shadow-lg scale-105'
                          : 'hover:bg-white/10 hover:border-white/20'
                      } ${selectedFlavors.length >= 3 && !isSelected ? 'opacity-30 cursor-not-allowed' : ''}`}
                      style={isSelected ? {
                        outline: `2px solid ${flavor.color}`,
                        outlineOffset: '2px',
                        boxShadow: `0 0 25px ${flavor.color}40`,
                        borderColor: `${flavor.color}60`,
                      } : {}}
                      disabled={selectedFlavors.length >= 3 && !isSelected}
                    >
                      <div className="text-3xl mb-1">{flavor.icon}</div>
                      <div className="text-sm font-body text-white/80 font-medium">{flavor.name}</div>
                      <div className="text-[10px] font-body text-white/40 mt-0.5">{flavor.desc}</div>
                      <div
                        className="w-5 h-5 rounded-full mx-auto mt-2 border border-white/20 transition-transform duration-300"
                        style={{
                          backgroundColor: flavor.color,
                          transform: isSelected ? 'scale(1.3)' : 'scale(1)',
                          boxShadow: isSelected ? `0 0 12px ${flavor.color}80` : 'none',
                        }}
                      />
                    </button>
                  )
                })}
              </div>

              {/* Custom name input */}
              <div className="mt-8">
                <label className="block text-sm font-body text-white/50 mb-2 uppercase tracking-wider">
                  Nombre de tu bebida
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value.slice(0, 12))}
                    placeholder="COSMIC DREAM..."
                    maxLength={12}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-heading tracking-wider text-lg placeholder:text-white/20 focus:outline-none focus:border-coke-neon/50 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-xs font-body">
                    {customName.length}/12
                  </span>
                </div>
              </div>

              {/* Selected flavors display */}
              <div className="mt-8">
                <h4 className="text-lg font-heading text-white/60 mb-3">Tu Mezcla</h4>
                <div className="flex gap-3">
                  {[0, 1, 2].map((i) => {
                    const flavor = selectedFlavors[i] ? flavors.find(f => f.id === selectedFlavors[i]) : null
                    return (
                      <div
                        key={i}
                        className="w-14 h-14 rounded-xl glass-card flex items-center justify-center transition-all duration-300"
                        style={flavor ? {
                          borderColor: `${flavor.color}40`,
                          boxShadow: `0 0 15px ${flavor.color}20`,
                        } : {}}
                      >
                        {flavor ? (
                          <span className="text-2xl">{flavor.icon}</span>
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-white/10" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Can preview */}
            <div className="can-preview flex flex-col items-center">
              <h3 className="text-2xl font-heading text-white mb-6">Vista Previa</h3>
              <div className="relative">
                <div
                  ref={canRef}
                  className="relative w-64 h-96 transition-all duration-700"
                >
                  {/* Can SVG */}
                  <svg viewBox="0 0 200 300" className="w-full h-full">
                    <defs>
                      <linearGradient id="canGradCreator" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={blendedColor} stopOpacity="0.7" />
                        <stop offset="30%" stopColor={blendedColor} stopOpacity="0.9" />
                        <stop offset="50%" stopColor={blendedColor} stopOpacity="1" />
                        <stop offset="70%" stopColor={blendedColor} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={blendedColor} stopOpacity="0.7" />
                      </linearGradient>
                      <linearGradient id="metalGradCreator" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#666" />
                        <stop offset="30%" stopColor="#aaa" />
                        <stop offset="50%" stopColor="#ddd" />
                        <stop offset="70%" stopColor="#aaa" />
                        <stop offset="100%" stopColor="#666" />
                      </linearGradient>
                      <filter id="canShadow">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={blendedColor} floodOpacity="0.4" />
                      </filter>
                    </defs>
                    {/* Top */}
                    <ellipse cx="100" cy="22" rx="68" ry="14" fill="url(#metalGradCreator)" />
                    {/* Body */}
                    <rect x="32" y="22" width="136" height="238" rx="4" fill="url(#canGradCreator)" filter="url(#canShadow)" />
                    {/* Highlight */}
                    <rect x="40" y="22" width="20" height="238" rx="2" fill="white" opacity="0.1" />
                    {/* Bottom */}
                    <ellipse cx="100" cy="260" rx="68" ry="14" fill="url(#metalGradCreator)" />
                    {/* Label area */}
                    <rect x="38" y="65" width="124" height="150" rx="3" fill="rgba(0,0,0,0.25)" />
                    {/* Brand */}
                    <text x="100" y="100" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter" opacity="0.5" letterSpacing="3">COKELAB</text>
                    {/* Custom name */}
                    <text x="100" y="135" textAnchor="middle" fill="white" fontSize="20" fontFamily="Bebas Neue" letterSpacing="2">
                      {displayName}
                    </text>
                    <text x="100" y="155" textAnchor="middle" fill="white" fontSize="9" fontFamily="Inter" opacity="0.5">FLAVOR LAB EDITION</text>
                    {/* Flavor indicators */}
                    {selectedFlavors.map((fid, i) => {
                      const f = flavors.find((fl) => fl.id === fid)
                      const xPos = selectedFlavors.length === 1 ? 100 :
                        selectedFlavors.length === 2 ? 80 + i * 40 : 60 + i * 40
                      return (
                        <g key={fid}>
                          <circle cx={xPos} cy="185" r="13" fill={f?.color || '#ccc'} opacity="0.9" />
                          <text x={xPos} y="189" textAnchor="middle" fontSize="12" fill="white">
                            {f?.icon}
                          </text>
                        </g>
                      )
                    })}
                  </svg>

                  {/* Confetti particles */}
                  {confettiParticles.map((particle, i) => (
                    <div
                      key={i}
                      className="confetti-particle absolute opacity-0 pointer-events-none"
                      style={{
                        backgroundColor: particle.color,
                        left: '50%',
                        top: '40%',
                        width: particle.size,
                        height: particle.size,
                        borderRadius: i % 2 === 0 ? '50%' : '2px',
                        transform: `rotate(${particle.angle}deg)`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleBottle}
                disabled={selectedFlavors.length === 0 || isBottling}
                className={`mt-8 px-10 py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${
                  selectedFlavors.length > 0 && !isBottling
                    ? 'bg-gradient-to-r from-coke-red to-coke-neon text-white shadow-glow-lg hover:shadow-glow hover:scale-105'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                {isBottling ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40 60" />
                    </svg>
                    Embotellando...
                  </span>
                ) : '🍾 ¡Embotellar!'}
              </button>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="text-center py-12">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-coke-red to-coke-neon flex items-center justify-center mx-auto shadow-glow-lg">
                <span className="text-5xl">🎉</span>
              </div>
              <div className="absolute inset-0 rounded-full animate-ping bg-coke-red/20" />
            </div>
            <h3 className="text-4xl font-heading text-white mb-4">
              ¡<span className="text-coke-neon">{displayName}</span> Embotellada!
            </h3>
            <p className="text-white/60 font-body max-w-md mx-auto mb-4">
              Tu mezcla personalizada con{' '}
              {selectedFlavors.map((id, i) => {
                const f = flavors.find(fl => fl.id === id)
                return (
                  <span key={id}>
                    {i > 0 && (i === selectedFlavors.length - 1 ? ' y ' : ', ')}
                    <span style={{ color: f?.color }}>{f?.name}</span>
                  </span>
                )
              })}{' '}
              ha sido enviada a producción galáctica.
            </p>
            <p className="text-white/30 font-body text-sm mb-8">
              Pronto recibirás tu bebida en cualquier punto del universo conocido.
            </p>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-gradient-to-r from-coke-red to-coke-neon text-white font-semibold rounded-xl hover:shadow-glow-lg transition-all duration-300 text-sm"
            >
              Crear Otra Mezcla
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
})

export default FlavorCreator
