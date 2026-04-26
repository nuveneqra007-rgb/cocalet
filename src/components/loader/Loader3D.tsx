import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface Loader3DProps {
  onComplete?: () => void;
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountNode.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 800;
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i++) {
      starsPositions[i] = (Math.random() - 0.5) * 20;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.6
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const particlesCount = 3000;
    const particlesGeometry = new THREE.BufferGeometry();
    const targetPositions = new Float32Array(particlesCount * 3);
    const initialPositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const radiusInit = 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      initialPositions[i * 3] = Math.sin(phi) * Math.cos(theta) * radiusInit;
      initialPositions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radiusInit;
      initialPositions[i * 3 + 2] = Math.cos(phi) * radiusInit;

      const angle = Math.random() * Math.PI * 2;
      const height = Math.random() * 3 - 1.5;
      let radius = 0.6;
      if (height < -0.5) radius = 0.3;
      else if (height < 0.5) radius = 0.5 + Math.sin(height * 2) * 0.2;
      else radius = 0.25 + Math.cos(height * 1.5) * 0.15;

      targetPositions[i * 3] = Math.cos(angle) * radius;
      targetPositions[i * 3 + 1] = height;
      targetPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(initialPositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xe61d2b,
      size: 0.03,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(particlesMaterial, { opacity: 0, duration: 0.8 });
        gsap.to(starsMaterial, { opacity: 0, duration: 0.8 });
        gsap.to(renderer.domElement, { opacity: 0, duration: 0.8, onComplete: () => {
          renderer.dispose();
          if (onComplete) onComplete();
        }});
      }
    });

    const attr = particlesGeometry.attributes.position.array as Float32Array;
    const initialArray = initialPositions.slice();
    const targetArray = targetPositions.slice();

    tl.to({}, {
      duration: 3,
      ease: "power3.inOut",
      onUpdate: function() {
        const progress = this.progress();
        for (let i = 0; i < particlesCount * 3; i++) {
          attr[i] = initialArray[i] + (targetArray[i] - initialArray[i]) * progress;
        }
        particlesGeometry.attributes.position.needsUpdate = true;
      }
    });

    tl.to(camera.rotation, { y: Math.PI * 2, duration: 3, ease: "power2.inOut" }, 0);

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.0002;
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountNode?.removeChild(renderer.domElement);
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