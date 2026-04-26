import { useRef } from 'react'
import { Link } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Bottle3DViewer from '@/components/Bottle3DViewer'
import ExoticProductCard from '@/components/ExoticProductCard'
import WaveDivider from '@/components/WaveDivider'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

const stars = [...Array(60)].map((_, i) => ({
  left: `${(i * 7 + 3) % 100}%`,
  top: `${(i * 11 + 5) % 100}%`,
  size: (i % 3) + 1,
  delay: (i * 0.4) % 2,
}))

const bubbles = [...Array(18)].map((_, i) => ({
  left: `${(i * 13 + 7) % 100}%`,
  width: `${(i % 20) + 10}px`,
  height: `${(i % 20) + 10}px`,
  delay: `${(i * 0.5) % 3}s`,
  duration: `${((i % 3) + 4)}s`,
}))

const featuredProducts = [
  {
    name: 'COSMIC FIZZ',
    image: '/images/products/can-classic.png',
    color: '#FF2A3B',
    description: 'Explosión de sabores intergalácticos con burbujas de energía pura',
  },
  {
    name: 'NEBULA COLA',
    image: '/images/products/can-zero.png',
    color: '#1E90FF',
    description: 'Cola clásica infusionada con polvo de nebulosa cósmica',
  },
]

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: 'Sabor Único',
    desc: 'Cada producto es un viaje a una dimensión de sabor que desafía el universo conocido.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    title: 'Experiencia 3D',
    desc: 'Tecnología inmersiva que te permite tocar, girar y sentir cada producto como nunca antes.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
    title: 'Innovación',
    desc: 'Fusionamos alquimia y tecnología para crear sabores que desafían el tiempo y el espacio.',
  },
]

export default function Home() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bottleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Split title into letters and animate
      if (titleRef.current) {
        const text = titleRef.current.innerText
        titleRef.current.innerHTML = ''
        text.split('').forEach((char) => {
          const span = document.createElement('span')
          span.innerText = char === ' ' ? '\u00A0' : char
          span.className = 'title-char'
          span.style.display = 'inline-block'
          gsap.set(span, { opacity: 0, y: -120, rotateX: -90, scale: 0.5 })
          titleRef.current!.appendChild(span)
        })

        gsap.to('.title-char', {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          stagger: 0.04,
          delay: 0.3,
          ease: 'bounce.out',
        })
      }

      // Subtitle liquid reveal
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.2, delay: 1.0, ease: 'power3.out' }
      )

      // Tagline fade
      gsap.fromTo(taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 1.3, ease: 'power3.out' }
      )

      // CTA buttons
      gsap.fromTo(ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 1.5, ease: 'power3.out' }
      )

      // Bottle entrance with dramatic scale
      gsap.fromTo(bottleRef.current,
        { opacity: 0, scale: 0.3, rotateY: -60 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 1.8, delay: 0.6, ease: 'elastic.out(1, 0.5)' }
      )

      // Features cards with ScrollTrigger
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll('.feature-card')
        gsap.fromTo(cards,
          { opacity: 0, y: 60, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 80%',
            },
          }
        )
      }

      // Products stagger
      gsap.fromTo('.featured-product',
        { opacity: 0, y: 60, scale: 0.8, rotateY: -20 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: '.featured-products-grid',
            start: 'top 80%',
          },
        }
      )

      // Mouse parallax on hero
      const hero = heroRef.current
      if (hero) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = hero.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width - 0.5
          const y = (e.clientY - rect.top) / rect.height - 0.5

          gsap.to(bottleRef.current, {
            rotateY: x * 25,
            rotateX: -y * 15,
            duration: 0.6,
            ease: 'power2.out',
          })
        }

        hero.addEventListener('mousemove', handleMouseMove)
        return () => hero.removeEventListener('mousemove', handleMouseMove)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <div ref={sectionRef} className="relative min-h-screen overflow-hidden bg-coke-dark">
      {/* Cosmic background */}
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse-glow"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: 0.5,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-coke-red/15 animate-float"
            style={{
              left: bubble.left,
              width: bubble.width,
              height: bubble.height,
              animationDelay: bubble.delay,
              animationDuration: bubble.duration,
            }}
          />
        ))}
      </div>

      {/* === HERO === */}
      <div
        ref={heroRef}
        className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-6 pt-24 pb-12 gap-8 lg:gap-16 max-w-7xl mx-auto"
      >
        <div className="flex-1 text-center lg:text-left">
          <h1
            ref={titleRef}
            className="text-7xl sm:text-8xl lg:text-9xl xl:text-[10rem] font-heading text-white leading-none tracking-wider"
            style={{ perspective: '1000px' }}
          >
            COKELAB
          </h1>
          <p
            ref={subtitleRef}
            className="mt-3 text-3xl sm:text-4xl font-heading text-coke-neon tracking-[0.3em]"
          >
            EL ORIGEN
          </p>
          <p
            ref={taglineRef}
            className="mt-6 text-lg sm:text-xl text-white/60 font-body max-w-lg mx-auto lg:mx-0 leading-relaxed"
          >
            Descubre la magia detrás del sabor que ha refrescado al mundo durante más de un siglo.
            Una experiencia líquida inmersiva donde el futuro y la tradición se fusionan.
          </p>
          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link
              to="/productos"
              className="group relative px-8 py-4 bg-gradient-to-r from-coke-red to-coke-neon text-white font-semibold rounded-xl overflow-hidden text-sm tracking-wide shadow-glow hover:shadow-glow-lg transition-shadow duration-300"
            >
              <span className="relative z-10">Explorar Productos</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Link>
            <Link
              to="/historia"
              className="group relative px-8 py-4 border border-white/20 text-white font-medium rounded-xl overflow-hidden text-sm tracking-wide backdrop-blur-sm hover:border-coke-neon/50 transition-all duration-300"
            >
              <span className="relative z-10">Ver Historia</span>
              <div className="absolute inset-0 bg-coke-red/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center perspective-1000">
          <div ref={bottleRef} className="w-full max-w-sm lg:max-w-md">
            <Bottle3DViewer color="#E61D2B" accentColor="#FF2A3B" />
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <WaveDivider color="rgba(230, 29, 43, 0.08)" />

      {/* === FEATURED PRODUCTS === */}
      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading text-white text-center mb-4">
            Productos <span className="text-shimmer">Destacados</span>
          </h2>
          <p className="text-white/40 text-center mb-14 max-w-xl mx-auto font-body">
            Sabores que trascienden las galaxias
          </p>
          <div className="featured-products-grid grid grid-cols-1 md:grid-cols-2 gap-16 justify-items-center">
            {featuredProducts.map((product, index) => (
              <div
                key={index}
                className="featured-product transform hover:scale-105 transition-transform duration-500"
              >
                <ExoticProductCard
                  name={product.name}
                  image={product.image}
                  description={product.description}
                  flavorColor={product.color}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-14">
            <Link
              to="/productos"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-coke-red to-coke-neon text-white font-semibold rounded-xl text-sm tracking-wide hover:shadow-glow-lg transition-all duration-300"
            >
              Ver Todos los Productos
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <WaveDivider color="rgba(245, 176, 66, 0.06)" flip />

      {/* === FEATURES === */}
      <section className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-heading text-white text-center mb-4">
            ¿Por qué <span className="text-coke-neon">COKELAB</span>?
          </h2>
          <p className="text-white/40 text-center mb-14 max-w-xl mx-auto font-body">
            No solo es una bebida. Es una experiencia que redefine lo posible.
          </p>
          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="feature-card glass-card p-8 text-center group hover:border-coke-neon/30 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-coke-red/10 text-coke-neon mb-5 group-hover:bg-coke-red/20 group-hover:shadow-glow transition-all duration-500">
                  {feat.icon}
                </div>
                <h3 className="text-2xl font-heading text-white mb-3">{feat.title}</h3>
                <p className="text-white/50 font-body text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-coke-dark to-transparent pointer-events-none" />

      <Footer />
    </div>
  )
}