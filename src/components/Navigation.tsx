import { useEffect, useRef, useState } from 'react'
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

export default function Navigation() {
  const location = useLocation()
  const navRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { y: -100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 })
    }
  }, [])

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between liquid-glass rounded-2xl px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M20 5C20 5 8 12 8 22C8 28 13 33 20 33C27 33 32 28 32 22C32 12 20 5 20 5Z" stroke="#E61D2B" strokeWidth="2" fill="none" className="nav-bottle-svg"/>
            <path d="M14 20C14 20 16 26 20 26C24 26 26 20 26 20" stroke="#FF2A3B" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="font-heading text-xl tracking-wider text-white">COKE<span className="text-coke-neon">LAB</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === link.path
                  ? 'text-coke-neon bg-coke-red/10'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 liquid-glass rounded-2xl p-4 mx-auto max-w-7xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? 'text-coke-neon bg-coke-red/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
