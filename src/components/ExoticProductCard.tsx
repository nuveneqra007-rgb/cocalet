import { useRef } from 'react'
import gsap from 'gsap'

interface ExoticProductCardProps {
  name: string
  image: string
  description: string
  flavorColor?: string
}

export default function ExoticProductCard({ 
  name, 
  image, 
  description, 
  flavorColor = '#E61D2B' 
}: ExoticProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20

    gsap.to(imageRef.current, {
      rotationY: x,
      rotationX: -y,
      duration: 0.4,
      ease: 'power2.out',
    })

    gsap.to(glowRef.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.4,
      ease: 'power2.out',
    })
    
    gsap.to(glowRef.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group cursor-pointer flex flex-col items-center"
      style={{ perspective: '1000px' }}
      role="article"
      aria-label={`Producto: ${name}`}
    >
      {/* Glow líquido detrás con clip-path orgánico */}
      <div
        ref={glowRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 25%, 85% 70%, 50% 100%, 15% 70%, 0% 25%)',
          background: `radial-gradient(circle at 50% 40%, ${flavorColor}60, transparent 70%)`,
          filter: 'blur(30px)',
          transform: 'scale(1.4)',
        }}
      />

      {/* Imagen de la botella con glow neón */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <img
          ref={imageRef}
          src={image}
          alt={`Botella de ${name}`}
          className="w-full max-w-[200px] object-contain transition-transform"
          style={{
            transformStyle: 'preserve-3d',
            filter: `drop-shadow(0 0 25px ${flavorColor}99)`,
          }}
        />
      </div>

      {/* Nombre del producto con glow */}
      <h3 
        className="relative z-20 mt-4 text-xl font-heading text-white tracking-widest uppercase"
        style={{ 
          textShadow: `0 0 20px ${flavorColor}, 0 0 40px ${flavorColor}80`,
          color: flavorColor,
        }}
      >
        {name}
      </h3>

      {/* Descripción */}
      <p className="relative z-20 text-sm text-white/60 mt-2 text-center font-body max-w-[200px]">
        {description}
      </p>

      {/* Borde neón en hover */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 25%, 85% 70%, 50% 100%, 15% 70%, 0% 25%)',
          border: `2px solid ${flavorColor}`,
          boxShadow: `0 0 30px ${flavorColor}80, inset 0 0 20px ${flavorColor}40`,
        }}
      />
    </div>
  )
}