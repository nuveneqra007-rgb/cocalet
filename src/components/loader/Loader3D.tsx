import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface Loader3DProps {
  onComplete?: () => void;
}

// Function to generate a glowing radial texture for particles
function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(230, 29, 43, 0.4)'); // Coke Red tint
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

export default function Loader3D({ onComplete }: Loader3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const mountNode = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mountNode.appendChild(renderer.domElement);

    // Mouse Interaction Setup
    const mouse = new THREE.Vector2(-9999, -9999);
    const mouse3D = new THREE.Vector3(-9999, -9999, 0);
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Adaptive particle count based on device
    const isMobile = window.innerWidth < 768;
    const particlesCount = isMobile ? 1500 : 4000; // Increased for WOW factor!
    
    const particlesGeometry = new THREE.BufferGeometry();
    const targetPositions = new Float32Array(particlesCount * 3);
    const initialPositions = new Float32Array(particlesCount * 3);
    const basePositions = new Float32Array(particlesCount * 3); // GSAP animates this
    const currentPositions = new Float32Array(particlesCount * 3); // Physics updates this
    const velocities = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    const colorRed = new THREE.Color('#E61D2B'); // Coke Red
    const colorNeon = new THREE.Color('#FF2A3B'); // Neon Red
    const colorDarkRed = new THREE.Color('#900C16'); // Dark liquid

    // Mathematical profile of the Coca-Cola Contour Bottle
    const profile = [
      [0.00, 0.28], // Bottom lip
      [0.02, 0.38], // Base bulge
      [0.10, 0.40], // Lower body straight
      [0.25, 0.42], // Lower body max width
      [0.45, 0.32], // The waist
      [0.60, 0.41], // Upper body max width
      [0.75, 0.25], // Shoulder
      [0.85, 0.12], // Neck thin
      [0.92, 0.11], // Neck top
      [0.93, 0.13], // Cap ring
      [0.95, 0.12], // Cap start
      [1.00, 0.12]  // Cap top
    ];

    const getRadius = (t: number) => {
      if (t <= 0) return profile[0][1];
      if (t >= 1) return profile[profile.length - 1][1];
      for (let j = 0; j < profile.length - 1; j++) {
        if (t >= profile[j][0] && t <= profile[j+1][0]) {
          const p1 = profile[j];
          const p2 = profile[j+1];
          const segmentT = (t - p1[0]) / (p2[0] - p1[0]);
          const smoothT = segmentT * segmentT * (3 - 2 * segmentT);
          return p1[1] + (p2[1] - p1[1]) * smoothT;
        }
      }
      return 0.12;
    };

    for (let i = 0; i < particlesCount; i++) {
      // 1. Initial Position (Sphere)
      const radiusInit = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const ix = Math.sin(phi) * Math.cos(theta) * radiusInit;
      const iy = Math.sin(phi) * Math.sin(theta) * radiusInit;
      const iz = Math.cos(phi) * radiusInit;
      
      initialPositions[i * 3] = ix;
      initialPositions[i * 3 + 1] = iy;
      initialPositions[i * 3 + 2] = iz;

      // 2. Target Position (Coca-Cola Bottle)
      const angle = Math.random() * Math.PI * 2;
      // Focus particles between height -1.5 and +1.5
      const height = Math.random() * 3.0 - 1.5;
      const t = (height + 1.5) / 3.0; // Normalized 0.0 to 1.0
      
      const maxRadius = getRadius(t);
      
      let finalRadius = maxRadius;
      let isLiquid = false;
      
      // 70% chance to be Glass Surface, 30% chance to be Liquid Core
      if (Math.random() < 0.3 && t < 0.8) {
         isLiquid = true;
         // Uniform distribution inside a circle (sqrt)
         finalRadius = maxRadius * Math.pow(Math.random(), 0.5);
      } else {
         // Glass surface with tiny noise
         finalRadius = maxRadius + (Math.random() - 0.5) * 0.015;
      }

      targetPositions[i * 3] = Math.cos(angle) * finalRadius;
      targetPositions[i * 3 + 1] = height;
      targetPositions[i * 3 + 2] = Math.sin(angle) * finalRadius;

      // Initialize base and current positions
      basePositions[i * 3] = ix;
      basePositions[i * 3 + 1] = iy;
      basePositions[i * 3 + 2] = iz;
      currentPositions[i * 3] = ix;
      currentPositions[i * 3 + 1] = iy;
      currentPositions[i * 3 + 2] = iz;

      // 3. Volumetric Colors
      const c = new THREE.Color();
      const rand = Math.random();
      
      if (t > 0.93) {
        // Cap
        if (rand > 0.8) c.copy(new THREE.Color('#ffffff'));
        else c.copy(colorRed);
      } else if (isLiquid) {
        // Liquid Core (darker red and some bubbles)
        if (rand > 0.6) c.copy(colorDarkRed);
        else c.copy(colorRed);
      } else {
        // Glass Surface
        if (rand > 0.92) c.copy(new THREE.Color('#ffffff')); // Highlights
        else if (rand > 0.7) c.lerpColors(colorRed, colorNeon, rand);
        else c.copy(colorRed);
      }
      
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const glowTexture = createGlowTexture();

    const particlesMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.1 : 0.08,
      map: glowTexture,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Timeline for Vortex GSAP Animation
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(particlesMaterial, { opacity: 0, duration: 0.6, ease: 'power2.inOut' });
        gsap.to(renderer.domElement, { opacity: 0, duration: 0.6, delay: 0.2, onComplete: () => {
          particlesGeometry.dispose();
          particlesMaterial.dispose();
          glowTexture.dispose();
          renderer.dispose();
          if (onComplete) onComplete();
        }});
      }
    });

    // Vortex GSAP Animation
    tl.to({}, {
      duration: 2.5,
      ease: "power3.inOut",
      onUpdate: function() {
        const progress = this.progress();
        
        for (let i = 0; i < particlesCount; i++) {
          const idx = i * 3;
          
          // 1. Linear interpolation towards bottle
          const lx = initialPositions[idx] + (targetPositions[idx] - initialPositions[idx]) * progress;
          const ly = initialPositions[idx+1] + (targetPositions[idx+1] - initialPositions[idx+1]) * progress;
          const lz = initialPositions[idx+2] + (targetPositions[idx+2] - initialPositions[idx+2]) * progress;
          
          // 2. Apply Swirl (Vortex) Effect
          // Swirl is strongest in the middle of the transition
          const swirlIntensity = Math.sin(progress * Math.PI); 
          const angle = swirlIntensity * Math.PI * 3.0; // Rotate up to 3 times
          
          const s = Math.sin(angle);
          const c = Math.cos(angle);
          
          basePositions[idx] = lx * c - lz * s;
          basePositions[idx+1] = ly;
          basePositions[idx+2] = lx * s + lz * c;
        }
      }
    });

    // Slight global rotation
    tl.to(camera.rotation, { y: Math.PI * 2, duration: 2.5, ease: "power2.inOut" }, 0);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      
      // Update mouse 3D position
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, mouse3D);
      
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particlesCount; i++) {
        const idx = i * 3;
        
        const bx = basePositions[idx];
        const by = basePositions[idx + 1];
        const bz = basePositions[idx + 2];
        
        let px = positions[idx];
        let py = positions[idx + 1];
        let pz = positions[idx + 2];
        
        // --- Interactive Mouse Repulsion ---
        const dx = px - mouse3D.x;
        const dy = py - mouse3D.y;
        const distSq = dx * dx + dy * dy;
        
        // If close to mouse, repel!
        if (distSq < 1.0) {
           const force = (1.0 - distSq) * 0.15; // Repulsion strength
           velocities[idx] += dx * force;
           velocities[idx+1] += dy * force;
        }

        // --- Spring Force towards target (GSAP animated) position ---
        velocities[idx] += (bx - px) * 0.1;   // Spring constant
        velocities[idx+1] += (by - py) * 0.1;
        velocities[idx+2] += (bz - pz) * 0.1;

        // --- Damping (Friction) ---
        velocities[idx] *= 0.82;
        velocities[idx+1] *= 0.82;
        velocities[idx+2] *= 0.82;

        // Apply velocity to current position
        positions[idx] += velocities[idx];
        positions[idx+1] += velocities[idx+1];
        positions[idx+2] += velocities[idx+2];
      }
      
      particlesGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      if (mountNode?.contains(renderer.domElement)) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, [onComplete]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        background: '#0a0a0a',
      }}
    />
  );
}