import { useRef, useState, memo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

interface Bottle3DViewerProps {
  color?: string;
  accentColor?: string;
}

function BottleGeometry({ color = "#E61D2B", accentColor = "#FF2A3B" }: Bottle3DViewerProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Botella cuerpo principal */}
      <mesh position={[0, -0.3, 0]}>
        <capsuleGeometry args={[0.5, 1.8, 16, 32]} />
        <MeshTransmissionMaterial
          color={color}
          transmission={0.6}
          thickness={0.5}
          roughness={0.1}
          metalness={0.1}
          chromaticAberration={0.1}
          anisotropicBlur={0.1}
        />
      </mesh>
      
      {/* Cuello de la botella */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.12, 0.25, 0.6, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Tapa */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.15, 32]} />
        <meshStandardMaterial
          color={accentColor}
          metalness={0.9}
          roughness={0.1}
          emissive={accentColor}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Etiqueta brillante */}
      <mesh position={[0, -0.2, 0.51]}>
        <planeGeometry args={[0.6, 0.8]} />
        <meshBasicMaterial
          color={accentColor}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Brillo de líquido */}
      <mesh position={[0, -0.3, 0.2]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          emissive={accentColor}
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

/** SVG fallback when WebGL is not available or context is lost */
function BottleFallback({ color = "#E61D2B", accentColor = "#FF2A3B" }: Bottle3DViewerProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative" style={{ animation: 'floatGentle 4s ease-in-out infinite' }}>
        {/* Glow behind */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)` }}
        />
        <svg width="160" height="280" viewBox="0 0 160 280" fill="none" className="relative">
          {/* Bottle shape */}
          <path
            d="M80 10 C80 10 55 25 55 50 L55 70 C55 85 35 95 30 120 L30 220 C30 250 50 270 80 270 C110 270 130 250 130 220 L130 120 C125 95 105 85 105 70 L105 50 C105 25 80 10 80 10Z"
            fill={color}
            opacity="0.8"
            stroke={accentColor}
            strokeWidth="2"
          />
          {/* Highlight */}
          <path
            d="M60 50 C60 50 55 70 50 100 L50 200 C50 215 55 220 65 220 L65 70 C65 55 60 50 60 50Z"
            fill="white"
            opacity="0.15"
          />
          {/* Cap */}
          <rect x="65" y="5" width="30" height="12" rx="3" fill={accentColor} />
          {/* Label */}
          <rect x="45" y="130" width="70" height="60" rx="4" fill="rgba(0,0,0,0.3)" />
          <text x="80" y="155" textAnchor="middle" fill="white" fontSize="8" fontFamily="Inter" opacity="0.6" letterSpacing="2">COKELAB</text>
          <text x="80" y="175" textAnchor="middle" fill="white" fontSize="14" fontFamily="Bebas Neue" letterSpacing="1">CLASSIC</text>
        </svg>
      </div>
    </div>
  );
}

export default memo(function Bottle3DViewer({ color = "#E61D2B", accentColor = "#FF2A3B" }: Bottle3DViewerProps) {
  const [hasError, setHasError] = useState(false);

  // On mobile with limited GPU, or when WebGL context is lost, show SVG fallback
  if (hasError) {
    return (
      <div className="w-full h-[350px] sm:h-[450px] lg:h-[500px] relative">
        <BottleFallback color={color} accentColor={accentColor} />
      </div>
    );
  }

  return (
    <div className="w-full h-[350px] sm:h-[450px] lg:h-[500px] relative">
      <Suspense fallback={<BottleFallback color={color} accentColor={accentColor} />}>
        <Canvas
          camera={{ position: [0, 0, 4], fov: 45 }}
          dpr={[1, Math.min(window.devicePixelRatio, 2)]}
          performance={{ min: 0.5 }}
          onCreated={({ gl }) => {
            // Handle WebGL context loss gracefully
            const canvas = gl.domElement;
            canvas.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              setHasError(true);
            });
          }}
        >
          <ambientLight intensity={0.4} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color={accentColor} />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <BottleGeometry color={color} accentColor={accentColor} />
          </Float>
          
          <Environment preset="city" />
        </Canvas>
      </Suspense>
    </div>
  );
});