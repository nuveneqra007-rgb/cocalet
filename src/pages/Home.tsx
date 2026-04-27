import { useRef, memo, useEffect } from 'react'
import { Link } from 'react-router'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ExoticProductCard from '@/components/ExoticProductCard'
import WaveDivider from '@/components/WaveDivider'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

const stars = [...Array(40)].map((_, i) => ({
  left: `${(i * 7 + 3) % 100}%`,
  top: `${(i * 11 + 5) % 100}%`,
  size: (i % 3) + 1,
  delay: (i * 0.4) % 2,
}))

const featuredProducts = [
  {
    name: 'COSMIC FIZZ',
    image: '/images/products/cosmic_fizz.png',
    color: '#FF2A3B',
    description: 'Explosión de sabores intergalácticos con burbujas de energía pura',
  },
  {
    name: 'NEBULA COLA',
    image: '/images/products/nebula_cola.png',
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

const Home = memo(function Home() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const bottleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const productsHeadingRef = useRef<HTMLDivElement>(null)
  const whyHeadingRef = useRef<HTMLDivElement>(null)
  const isMobile = useRef(window.innerWidth < 768)

  // Detect mobile on mount
  useEffect(() => {
    const check = () => { isMobile.current = window.innerWidth < 768 }
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const mobile = isMobile.current

      // ======================================
      // HERO ENTRANCE — Cinematic, staggered
      // ======================================
      const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } })

      // Title: liquid reveal with clip-path
      heroTL.fromTo(titleRef.current,
        { opacity: 0, y: mobile ? 20 : 40, clipPath: 'inset(100% 0 0 0)' },
        { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 1.2 }
      )

      // Subtitle: fade + slide from left on desktop, up on mobile
      heroTL.fromTo(subtitleRef.current,
        { opacity: 0, x: mobile ? 0 : -30, y: mobile ? 15 : 0 },
        { opacity: 1, x: 0, y: 0, duration: 0.8 },
        '-=0.7'
      )

      // Tagline: smooth rise
      heroTL.fromTo(taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )

      // CTA: pop in
      heroTL.fromTo(ctaRef.current,
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7 },
        '-=0.4'
      )

      // Spline scene: cinematic entrance
      heroTL.fromTo(bottleRef.current,
        { opacity: 0, scale: mobile ? 0.9 : 0.8, y: mobile ? 30 : 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: 'power3.out' },
        '-=1.2'
      )

      // ======================================
      // SCROLL-TRIGGERED CINEMATIC REVEALS
      // ======================================

      // Products heading — text reveal
      if (productsHeadingRef.current) {
        gsap.fromTo(productsHeadingRef.current,
          { opacity: 0, y: 50, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: productsHeadingRef.current,
              start: 'top 90%',
            },
          }
        )
      }

      // Featured products — staggered reveal with subtle rotation
      gsap.fromTo('.featured-product',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.featured-products-grid',
            start: 'top 85%',
          },
        }
      )

      // Why COKELAB heading
      if (whyHeadingRef.current) {
        gsap.fromTo(whyHeadingRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: whyHeadingRef.current,
              start: 'top 90%',
            },
          }
        )
      }

      // Features cards — cinematic stagger
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll('.feature-card')
        gsap.fromTo(cards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 85%',
            },
          }
        )
      }

      // CTA button at bottom
      gsap.fromTo('.products-cta-btn',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.products-cta-btn',
            start: 'top 95%',
          },
        }
      )

      // ======================================
      // PARALLAX & MICRO-INTERACTIONS
      // ======================================

      // Scroll-driven parallax on cosmic background
      gsap.to('.cosmic-bg', {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, { scope: sectionRef })

  return (
    <div ref={sectionRef} className="relative min-h-screen overflow-hidden gradient-shift">
      {/* Cosmic background — parallax target */}
      <div className="absolute inset-0 cosmic-bg pointer-events-none will-change-transform" />

      {/* Stars — reduced count for performance */}
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
              opacity: 0.4,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* === HERO === */}
      <div
        ref={heroRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 sm:px-6 pt-20 pb-10 overflow-hidden"
      >
        {/* Spline Fullscreen Background */}
        <div ref={bottleRef} className="absolute inset-0 z-0 pointer-events-auto will-change-transform">
          <iframe 
            src="https://my.spline.design/particlesflow-EoDtiMadOFIeOboSDcVWpwH7/" 
            frameBorder="0" 
            className="absolute top-[-60px] left-[-60px] w-[calc(100%+120px)] h-[calc(100%+120px)]"
            title="Spline Fullscreen Background"
          />
          {/* Oscurecimiento sutil para que los textos destaquen más */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>

        {/* Text Content - Centered */}
        <div className="relative z-20 text-center pointer-events-none w-full max-w-4xl mx-auto flex flex-col items-center">
          <h1
            ref={titleRef}
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-heading text-white leading-[0.9] tracking-wider neon-glow"
            style={{ perspective: '1000px' }}
          >
            COKELAB
          </h1>
          <p
            ref={subtitleRef}
            className="mt-4 sm:mt-5 text-2xl sm:text-3xl md:text-4xl font-heading text-coke-neon tracking-[0.3em]"
          >
            EL ORIGEN
          </p>
          <p
            ref={taglineRef}
            className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-white/80 font-body max-w-2xl mx-auto leading-relaxed font-light"
          >
            Descubre la magia detrás del sabor que ha refrescado al mundo durante más de un siglo.
            Una experiencia líquida inmersiva donde el futuro y la tradición se fusionan.
          </p>
          <div ref={ctaRef} className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-4 justify-center pointer-events-auto">
            <Link
              to="/productos"
              className="btn-liquid text-center shadow-[0_0_20px_rgba(230,29,43,0.4)]"
            >
              Explorar Productos
            </Link>
            <Link
              to="/historia"
              className="group relative px-8 py-4 border border-white/20 text-white font-medium rounded-xl overflow-hidden text-sm tracking-wide backdrop-blur-md hover:border-coke-neon/50 transition-all duration-300 text-center tap-target hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              <span className="relative z-10">Ver Historia</span>
              <div className="absolute inset-0 bg-coke-red/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Link>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <WaveDivider color="rgba(230, 29, 43, 0.08)" />

      {/* === FEATURED PRODUCTS === */}
      <section className="py-14 sm:py-20 px-5 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div ref={productsHeadingRef}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-white text-center mb-3 sm:mb-4">
              Productos <span className="text-shimmer">Destacados</span>
            </h2>
            <p className="text-white/40 text-center mb-10 sm:mb-14 max-w-xl mx-auto font-body text-sm sm:text-base">
              Sabores que trascienden las galaxias
            </p>
          </div>
          <div className="featured-products-grid grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 justify-items-center">
            {featuredProducts.map((product, index) => (
              <div
                key={index}
                className="featured-product will-change-transform transform hover:scale-105 active:scale-[0.98] transition-transform duration-500"
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
          <div className="text-center mt-10 sm:mt-14 products-cta-btn">
            <Link
              to="/productos"
              className="btn-liquid inline-flex items-center gap-2"
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
      <section className="py-14 sm:py-20 px-5 sm:px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div ref={whyHeadingRef}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-white text-center mb-3 sm:mb-4">
              ¿Por qué <span className="text-coke-neon">COKELAB</span>?
            </h2>
            <p className="text-white/40 text-center mb-10 sm:mb-14 max-w-xl mx-auto font-body text-sm sm:text-base">
              No solo es una bebida. Es una experiencia que redefine lo posible.
            </p>
          </div>
          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="feature-card glass-card p-6 sm:p-8 text-center group hover:border-coke-neon/30 transition-all duration-500 liquid-glow"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-coke-red/10 text-coke-neon mb-4 sm:mb-5 group-hover:bg-coke-red/20 group-hover:shadow-glow transition-all duration-500">
                  {feat.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-heading text-white mb-2 sm:mb-3">{feat.title}</h3>
                <p className="text-white/50 font-body text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
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
})

export default Home