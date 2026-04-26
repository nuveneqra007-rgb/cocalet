import { useEffect, useRef, useState, memo } from 'react'
import gsap from 'gsap'
import Footer from '@/components/Footer'

const contactInfo = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: 'Email',
    value: 'hola@cokelab.com',
    color: '#E61D2B',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Ubicación',
    value: 'Atlanta, Georgia',
    color: '#3b82f6',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Horario',
    value: '24/7 en el cosmos',
    color: '#F5B042',
  },
]

const Contact = memo(function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const liquidRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-title', { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1, ease: 'power3.out' })
      gsap.fromTo('.contact-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 })
      gsap.fromTo('.contact-form', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 })
      gsap.fromTo('.contact-info-card',
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.5 }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    // Animate liquid fill on focus
    if (focusedField && liquidRefs.current[focusedField]) {
      gsap.to(liquidRefs.current[focusedField], {
        scaleY: 1,
        duration: 0.6,
        ease: 'power2.out',
      })
    }
    // Animate out other fields
    Object.entries(liquidRefs.current).forEach(([key, el]) => {
      if (el && key !== focusedField) {
        gsap.to(el, { scaleY: 0, duration: 0.4, ease: 'power2.in' })
      }
    })
  }, [focusedField])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido'
    if (!formData.message.trim()) newErrors.message = 'El mensaje es requerido'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || !validate()) return
    setIsSubmitting(true)

    // Animated submission
    const tl = gsap.timeline({
      onComplete: () => {
        setIsSubmitting(false)
        setSubmitted(true)
        // Success animation
        gsap.fromTo('.success-container',
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
        )
      },
    })

    tl.to(formRef.current, {
      scale: 0.95,
      opacity: 0.5,
      duration: 0.3,
      ease: 'power2.in',
    })
    .to(formRef.current, {
      scale: 0.8,
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: 'power2.in',
    })
  }

  const fields = [
    { id: 'name', label: 'Nombre', type: 'text', placeholder: '¿Cómo te llamas?' },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
    { id: 'message', label: 'Mensaje', type: 'textarea', placeholder: 'Cuéntanos algo refrescante...' },
  ]

  return (
    <div ref={sectionRef} className="relative min-h-screen pt-24 sm:pt-28 pb-16 sm:pb-20">
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h1 className="contact-title text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-heading text-white mb-3 sm:mb-4">
            CONTACTO <span className="text-coke-neon">FRESCO</span>
          </h1>
          <p className="contact-subtitle text-white/50 max-w-xl mx-auto font-body text-base sm:text-lg">
            ¿Tienes una idea refrescante? Déjanos caer un mensaje y te responderemos
            en un abrir y cerrar de botella.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            {!submitted ? (
              <form ref={formRef} onSubmit={handleSubmit} className="contact-form space-y-6">
                {fields.map((field) => (
                  <div key={field.id} className="relative">
                    <label className="block text-sm font-body text-white/50 mb-2 uppercase tracking-wider">
                      {field.label}
                    </label>
                    <div className="relative overflow-hidden rounded-xl">
                      {/* Liquid background */}
                      <div
                        ref={(el) => { liquidRefs.current[field.id] = el }}
                        className="absolute bottom-0 left-0 right-0 h-full origin-bottom pointer-events-none rounded-xl"
                        style={{
                          transform: 'scaleY(0)',
                          background: 'linear-gradient(to top, rgba(230,29,43,0.08), rgba(255,42,59,0.04))',
                        }}
                      />
                      {field.type === 'textarea' ? (
                        <textarea
                          className={`relative w-full bg-white/5 border rounded-xl px-4 py-4 text-white outline-none transition-all duration-300 placeholder:text-white/25 font-body resize-none ${
                            errors[field.id] ? 'border-red-500/50' : focusedField === field.id ? 'border-coke-neon/50' : 'border-white/10'
                          }`}
                          rows={4}
                          placeholder={field.placeholder}
                          value={formData[field.id as keyof typeof formData]}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, [field.id]: e.target.value }))
                            if (errors[field.id]) setErrors(prev => ({ ...prev, [field.id]: '' }))
                          }}
                          onFocus={() => setFocusedField(field.id)}
                          onBlur={() => setFocusedField(null)}
                        />
                      ) : (
                        <input
                          type={field.type}
                          className={`relative w-full bg-white/5 border rounded-xl px-4 py-4 text-white outline-none transition-all duration-300 placeholder:text-white/25 font-body ${
                            errors[field.id] ? 'border-red-500/50' : focusedField === field.id ? 'border-coke-neon/50' : 'border-white/10'
                          }`}
                          placeholder={field.placeholder}
                          value={formData[field.id as keyof typeof formData]}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, [field.id]: e.target.value }))
                            if (errors[field.id]) setErrors(prev => ({ ...prev, [field.id]: '' }))
                          }}
                          onFocus={() => setFocusedField(field.id)}
                          onBlur={() => setFocusedField(null)}
                        />
                      )}
                    </div>
                    {/* Error message */}
                    {errors[field.id] && (
                      <p className="mt-1.5 text-xs text-red-400 font-body flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        {errors[field.id]}
                      </p>
                    )}
                    {/* Focus indicator bubbles */}
                    <div className="absolute right-4 top-10 pointer-events-none">
                      {focusedField === field.id && (
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-coke-neon/50 animate-pulse"
                              style={{ animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full py-4 bg-gradient-to-r from-coke-red to-coke-neon text-white font-semibold rounded-xl overflow-hidden hover:shadow-glow-lg transition-all duration-300 text-sm tracking-wide disabled:opacity-50"
                >
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40 60" />
                        </svg>
                        Enviando...
                      </span>
                    ) : 'Enviar Mensaje'}
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </button>
              </form>
            ) : (
              <div className="success-container text-center py-16">
                <div className="relative inline-block mb-6">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-coke-red to-coke-neon flex items-center justify-center mx-auto shadow-glow-lg">
                    <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-full animate-ping bg-coke-red/20" style={{ animationDuration: '2s' }} />
                </div>
                <h3 className="text-4xl font-heading text-white mb-4">¡Mensaje Enviado!</h3>
                <p className="text-white/60 font-body max-w-md mx-auto mb-2">
                  Tu mensaje ha sido encapsulado y enviado a través del cosmos.
                </p>
                <p className="text-white/30 font-body text-sm mb-8">
                  Te responderemos antes de que termine tu próxima Coca-Cola.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', email: '', message: '' })
                  }}
                  className="px-6 py-3 glass-card text-white/60 hover:text-white text-sm font-body rounded-xl transition-all duration-300 hover:border-white/20"
                >
                  Enviar otro mensaje
                </button>
              </div>
            )}
          </div>

          {/* Contact info sidebar */}
          <div className="space-y-4">
            {contactInfo.map((info, i) => (
              <div
                key={i}
                className="contact-info-card glass-card rounded-2xl p-5 group hover:border-white/20 transition-all duration-500"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:scale-110"
                    style={{ backgroundColor: `${info.color}15`, color: info.color }}
                  >
                    {info.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-body text-white/40 uppercase tracking-wider mb-1">
                      {info.title}
                    </h4>
                    <p className="text-white font-body text-sm">{info.value}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-sm font-body text-white/40 uppercase tracking-wider mb-3">
                Redes Sociales
              </h4>
              <div className="flex gap-2">
                {['Instagram', 'Twitter', 'YouTube', 'TikTok'].map((social) => (
                  <button
                    key={social}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-coke-neon hover:border-coke-neon/30 hover:bg-coke-red/10 transition-all duration-300 text-xs font-heading"
                  >
                    {social[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick tip */}
            <div className="glass-card rounded-2xl p-5 border-coke-gold/20">
              <div className="flex gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="text-sm font-heading text-coke-gold mb-1">Tip Rápido</h4>
                  <p className="text-white/40 font-body text-xs leading-relaxed">
                    También puedes crear tu propia bebida en nuestra sección{' '}
                    <a href="/crea-tu-coca" className="text-coke-neon hover:underline">Creador de Sabor</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
})

export default Contact
