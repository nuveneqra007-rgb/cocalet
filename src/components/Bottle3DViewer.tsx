import { useRef } from "react";
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

export default function Bottle3DViewer({ color = "#E61D2B", accentColor = "#FF2A3B" }: Bottle3DViewerProps) {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
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
    </div>
  );
}