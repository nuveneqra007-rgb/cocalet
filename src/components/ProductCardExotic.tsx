import { useRef } from "react";
import gsap from "gsap";

interface ProductCardExoticProps {
  name: string;
  image: string;
  description: string;
  flavorColor?: string;
}

export default function ProductCardExotic({ name, image, description, flavorColor = "#E61D2B" }: ProductCardExoticProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;

    gsap.to(imageRef.current, {
      rotationY: x,
      rotationX: -y,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(glowRef.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(glowRef.current, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group cursor-pointer w-64 h-96 flex flex-col items-center justify-end p-6"
      style={{ perspective: "600px" }}
    >
      {/* Glow radial detrás */}
      <div
        ref={glowRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 85% 70%, 50% 100%, 15% 70%, 0% 30%)",
          background: `radial-gradient(circle at 50% 40%, ${flavorColor}60, transparent 70%)`,
          filter: "blur(25px)",
          transform: "scale(1.3)",
        }}
      />

      {/* Borde neón */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 85% 70%, 50% 100%, 15% 70%, 0% 30%)",
          border: `2px solid ${flavorColor}`,
          boxShadow: `0 0 30px ${flavorColor}80, inset 0 0 30px ${flavorColor}40`,
        }}
      />

      <img
        ref={imageRef}
        src={image}
        alt={name}
        className="relative z-20 w-full h-auto object-contain drop-shadow-[0_0_25px_rgba(230,29,43,0.8)] transition-transform duration-300"
        style={{ 
          transformStyle: "preserve-3d",
          filter: `drop-shadow(0 0 20px ${flavorColor}90)`,
        }}
      />
      
      <h3 
        className="relative z-20 mt-4 text-xl font-heading text-white tracking-widest uppercase"
        style={{ textShadow: `0 0 20px ${flavorColor}` }}
      >
        {name}
      </h3>
      <p className="relative z-20 text-sm text-white/60 mt-2 text-center font-body">
        {description}
      </p>
    </div>
  );
}