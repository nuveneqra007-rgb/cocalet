import { useEffect, useRef, useState, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'

const navLinks = [
  { path: '/', label: 'Inicio' },
  { path: '/productos', label: 'Productos' },
  { path: '/historia', label: 'Historia' },
  { path: '/sostenibilidad', label: 'Sostenibilidad' },
  { path: '/crea-tu-coca', label: 'Creador' },
  { path: '/contacto', label: 'Contacto' },
]

export default memo(function Navigation() {
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Entrance animation
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
      )
    }
  }, [])

  // Scroll-based glass effect + hide on scroll down
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animate mobile menu open/close
  useEffect(() => {
    if (!mobileMenuRef.current) return
    
    if (menuOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { opacity: 0, y: -20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }
      )
      // Stagger links
      const links = mobileMenuRef.current.querySelectorAll('.mobile-nav-link')
      gsap.fromTo(links,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power3.out', delay: 0.1 }
      )
    }
  }, [menuOpen])

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-3'
      }`}
    >
      <div className={`max-w-7xl mx-auto flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all duration-500 ${
        scrolled
          ? 'liquid-glass shadow-lg shadow-black/20'
          : 'bg-transparent border border-transparent'
      }`}>
        <Link to="/" className="flex items-center gap-2 tap-target">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" className="sm:w-10 sm:h-10">
            <path d="M20 5C20 5 8 12 8 22C8 28 13 33 20 33C27 33 32 28 32 22C32 12 20 5 20 5Z" stroke="#E61D2B" strokeWidth="2" fill="none" className="nav-bottle-svg"/>
            <path d="M14 20C14 20 16 26 20 26C24 26 26 20 26 20" stroke="#FF2A3B" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="font-heading text-lg sm:text-xl tracking-wider text-white">COKE<span className="text-coke-neon">LAB</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === link.path
                  ? 'text-coke-neon bg-coke-red/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
              {/* Active indicator dot */}
              {location.pathname === link.path && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-coke-neon" />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile toggle — animated hamburger */}
        <button
          className="md:hidden text-white p-2 tap-target relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
              menuOpen ? 'rotate-45 translate-y-[9px]' : ''
            }`} />
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${
              menuOpen ? 'opacity-0 scale-0' : ''
            }`} />
            <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
              menuOpen ? '-rotate-45 -translate-y-[9px]' : ''
            }`} />
          </div>
        </button>
      </div>

      {/* Mobile menu — full-width with cinematic slide */}
      {menuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden mt-2 liquid-glass rounded-2xl p-4 mx-auto max-w-7xl overflow-hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`mobile-nav-link flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 tap-target ${
                  location.pathname === link.path
                    ? 'text-coke-neon bg-coke-red/10 border border-coke-red/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {/* Active indicator */}
                <span className={`w-1.5 h-1.5 rounded-full transition-all ${
                  location.pathname === link.path
                    ? 'bg-coke-neon shadow-[0_0_8px_rgba(255,42,59,0.6)]'
                    : 'bg-white/20'
                }`} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
})
