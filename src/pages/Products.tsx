import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ExoticProductCard from '@/components/ExoticProductCard'
import Bottle3DViewer from '@/components/Bottle3DViewer'
import Footer from '@/components/Footer'

gsap.registerPlugin(ScrollTrigger)

const products = [
  {
    id: 1,
    name: 'COSMIC FIZZ',
    image: '/images/products/can-classic.png',
    color: '#FF2A3B',
    description: 'Frambuesa estelar con burbujas de energía pura',
    category: 'classic',
  },
  {
    id: 2,
    name: 'NEBULA COLA',
    image: '/images/products/can-zero.png',
    color: '#1E90FF',
    description: 'Cola clásica con polvo de nebulosa cósmica',
    category: 'classic',
  },
  {
    id: 3,
    name: 'QUANTUM ZERO',
    image: '/images/products/can-light.png',
    color: '#00CED1',
    description: 'Zero azúcar, sabor cuántico infinito',
    category: 'zero',
  },
  {
    id: 4,
    name: 'CHERRY NOVA',
    image: '/images/products/can-cherry.png',
    color: '#8B0000',
    description: 'Estallido de cereza estelar supernova',
    category: 'sabores',
  },
  {
    id: 5,
    name: 'AURORA MANGO',
    image: '/images/products/bottle-classic.png',
    color: '#FF8C00',
    description: 'Mango tropical bañado en auroras boreales',
    category: 'sabores',
  },
  {
    id: 6,
    name: 'SOLAR PUNCH',
    image: '/images/products/can-classic.png',
    color: '#F5B042',
    description: 'Explosión solar de cítricos y energía dorada',
    category: 'classic',
  },
]

const categories = [
  { id: 'todos', label: 'Todos', count: products.length },
  { id: 'classic', label: 'Clásicas', count: products.filter(p => p.category === 'classic').length },
  { id: 'zero', label: 'Zero', count: products.filter(p => p.category === 'zero').length },
  { id: 'sabores', label: 'Sabores', count: products.filter(p => p.category === 'sabores').length },
]

export default function Products() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState('todos')
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)

  const filtered = activeCategory === 'todos'
    ? products
    : products.filter((p) => p.category === activeCategory)

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo('.products-title',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      )

      gsap.fromTo('.products-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
      )

      // Hero banner parallax
      gsap.fromTo('.products-hero-glow',
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 1.5, delay: 0.2, ease: 'power3.out' }
      )

      // 3D Viewer entrance
      gsap.fromTo('.bottle-viewer',
        { opacity: 0, scale: 0.8, rotateY: -30 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 1.2, delay: 0.5, ease: 'back.out(1.7)' }
      )

      // Category buttons
      gsap.fromTo('.category-btn',
        { opacity: 0, y: 20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, delay: 0.5, ease: 'back.out(1.7)' }
      )

      // Cards stagger with ScrollTrigger
      const cards = cardsRef.current?.querySelectorAll('.exotic-card')
      if (cards) {
        gsap.fromTo(cards,
          { opacity: 0, scale: 0.8, y: 60 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, { scope: sectionRef })

  const handleCategoryChange = (catId: string) => {
    // Animate cards out
    const cards = cardsRef.current?.querySelectorAll('.exotic-card')
    if (cards) {
      gsap.to(cards, {
        opacity: 0,
        scale: 0.8,
        y: 30,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          setActiveCategory(catId)
          // Animate cards in after state update
          requestAnimationFrame(() => {
            const newCards = cardsRef.current?.querySelectorAll('.exotic-card')
            if (newCards) {
              gsap.fromTo(newCards,
                { opacity: 0, scale: 0.8, y: 30 },
                { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)' }
              )
            }
          })
        },
      })
    } else {
      setActiveCategory(catId)
    }
  }

  return (
    <div ref={sectionRef} className="relative min-h-screen pt-28 pb-20">
      {/* Cosmic BG */}
      <div className="absolute inset-0 cosmic-bg pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero Banner */}
        <div className="relative mb-16 text-center">
          <div className="products-hero-glow absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 rounded-full bg-coke-red/10 blur-[100px]" />
          </div>
          <h1 className="products-title text-5xl sm:text-6xl lg:text-8xl font-heading text-white mb-4">
            UNIVERSO DE <span className="text-shimmer">SABORES</span>
          </h1>
          <p className="products-subtitle text-white/50 mb-4 max-w-2xl mx-auto font-body text-lg">
            Cada producto es un portal a una dimensión de sabor único.
            Explora nuestra colección cósmica.
          </p>
        </div>

        {/* Featured 3D Bottle Viewer */}
        <div className="bottle-viewer mb-20">
          <div className="glass-card rounded-3xl p-8 overflow-hidden relative">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-coke-red/20 border border-coke-red/30 text-coke-neon text-xs font-body">
              Interactivo 3D
            </div>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-3xl font-heading text-white mb-3">
                  Experiencia <span className="text-coke-neon">Inmersiva</span>
                </h3>
                <p className="text-white/50 font-body text-sm leading-relaxed max-w-md">
                  Observa la botella desde todos los ángulos. Nuestra tecnología 3D te permite
                  explorar cada detalle del diseño icónico que ha conquistado el mundo.
                </p>
              </div>
              <div className="flex-1 w-full">
                <Bottle3DViewer color="#E61D2B" accentColor="#FF2A3B" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`category-btn px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-coke-red to-coke-neon text-white shadow-glow'
                  : 'glass-card text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              {cat.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                activeCategory === cat.id ? 'bg-white/20' : 'bg-white/5'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Product count */}
        <p className="text-center text-white/30 text-sm font-body mb-10">
          {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Products Grid with Exotic Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
        >
          {filtered.map((product) => (
            <div
              key={product.id}
              className="exotic-card flex justify-center cursor-pointer"
              onClick={() => setSelectedProduct(product)}
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
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative glass-card rounded-3xl p-8 max-w-lg w-full animate-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <div
                  className="absolute inset-0 rounded-full blur-[40px]"
                  style={{ backgroundColor: `${selectedProduct.color}30` }}
                />
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="relative w-full h-full object-contain"
                  style={{ filter: `drop-shadow(0 0 30px ${selectedProduct.color}80)` }}
                />
              </div>
              <h3
                className="text-3xl font-heading tracking-widest mb-3"
                style={{ color: selectedProduct.color }}
              >
                {selectedProduct.name}
              </h3>
              <p className="text-white/60 font-body mb-6 leading-relaxed">
                {selectedProduct.description}.
                Una experiencia sensorial que combina la tradición con la innovación más
                vanguardista del universo de sabores COKELAB.
              </p>
              <div className="flex gap-3 justify-center">
                <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs font-body border border-white/10">
                  {selectedProduct.category === 'classic' ? 'Clásica' : selectedProduct.category === 'zero' ? 'Zero' : 'Sabor Especial'}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 text-white/40 text-xs font-body border border-white/10">
                  355ml
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}