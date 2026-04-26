import { Link } from 'react-router-dom'

const footerLinks = [
  { path: '/', label: 'Inicio' },
  { path: '/productos', label: 'Productos' },
  { path: '/historia', label: 'Historia' },
  { path: '/sostenibilidad', label: 'Sostenibilidad' },
  { path: '/crea-tu-coca', label: 'Creador' },
  { path: '/contacto', label: 'Contacto' },
]

const socialIcons = [
  {
    label: 'Instagram',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="relative z-20 mt-20">
      {/* Wave separator */}
      <div className="relative h-24 overflow-hidden">
        <svg
          className="absolute bottom-0 w-[200%]"
          style={{ animation: 'waveFlow 8s linear infinite' }}
          viewBox="0 0 2400 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 C1400,100 1600,20 1800,60 C2000,100 2200,20 2400,60 L2400,120 L0,120 Z"
            fill="rgba(230, 29, 43, 0.08)"
          />
          <path
            d="M0,80 C200,40 400,100 600,80 C800,40 1000,100 1200,80 C1400,40 1600,100 1800,80 C2000,40 2200,100 2400,80 L2400,120 L0,120 Z"
            fill="rgba(230, 29, 43, 0.05)"
          />
        </svg>
      </div>

      <div className="relative bg-gradient-to-b from-transparent via-white/[0.02] to-white/[0.04] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <Link to="/" className="inline-flex items-center gap-2 mb-4">
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 5C20 5 8 12 8 22C8 28 13 33 20 33C27 33 32 28 32 22C32 12 20 5 20 5Z"
                    stroke="#E61D2B"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M14 20C14 20 16 26 20 26C24 26 26 20 26 20"
                    stroke="#FF2A3B"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-heading text-2xl tracking-wider text-white">
                  COKE<span className="text-coke-neon">LAB</span>
                </span>
              </Link>
              <p className="text-white/40 text-sm font-body leading-relaxed max-w-xs">
                Una experiencia inmersiva que fusiona sabor, tecnología y creatividad.
                Descubre el universo de sabores que nadie más se atreve a crear.
              </p>
            </div>

            {/* Nav links */}
            <div>
              <h4 className="font-heading text-lg text-white/80 tracking-wider mb-4">NAVEGACIÓN</h4>
              <div className="grid grid-cols-2 gap-2">
                {footerLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm text-white/40 hover:text-coke-neon transition-colors duration-300 font-body py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Social + tagline */}
            <div>
              <h4 className="font-heading text-lg text-white/80 tracking-wider mb-4">SÍGUENOS</h4>
              <div className="flex gap-3 mb-6">
                {socialIcons.map((social) => (
                  <button
                    key={social.label}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center text-white/50 hover:text-coke-neon hover:shadow-glow transition-all duration-300"
                  >
                    {social.svg}
                  </button>
                ))}
              </div>
              <p className="text-white/30 text-xs font-body">
                Hecho con ❤️ y burbujas
              </p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-xs font-body">
              © {new Date().getFullYear()} COKELAB. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-white/20 text-xs font-body">Privacidad</span>
              <span className="text-white/20 text-xs font-body">Términos</span>
              <span className="text-white/20 text-xs font-body">Cookies</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
