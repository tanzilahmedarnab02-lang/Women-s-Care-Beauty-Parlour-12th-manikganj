import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onComplete: () => void;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textStage, setTextStage] = useState(0);

  // Text Animation Sequence
  useEffect(() => {
    const timer1 = setTimeout(() => setTextStage(1), 1000); // "Elysium"
    const timer2 = setTimeout(() => setTextStage(2), 2500); // "Beyond Beauty"
    const timer3 = setTimeout(() => {
       setTextStage(3); // Fade out
       setTimeout(onComplete, 1000); 
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  // Three.js Animation
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10; // Start closer

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Gold Particles
    const geometry = new THREE.BufferGeometry();
    const count = 4000;
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        // Spiral formation setup
        positions[i] = (Math.random() - 0.5) * 50;
        velocities[i] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xD4AF37,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let frameId: number;
    let time = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      time += 0.005;

      // Cinematic Camera Movement
      camera.position.z += (2 - camera.position.z) * 0.005; // Zoom in slowly
      camera.rotation.z += 0.001; // Slight roll

      // Particle Movement (Swirl)
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
         const i3 = i * 3;
         // Add subtle wave motion
         positions[i3 + 1] += Math.sin(time + positions[i3]) * 0.01;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = time * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
         containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <motion.div 
       className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
       exit={{ opacity: 0, transition: { duration: 1 } }}
    >
       <div ref={containerRef} className="absolute inset-0" />
       
       <div className="relative z-10 text-center mix-blend-screen">
          <AnimatePresence mode="wait">
            {textStage === 1 && (
              <motion.h1 
                key="title"
                initial={{ opacity: 0, scale: 0.8, letterSpacing: '0.5em' }}
                animate={{ opacity: 1, scale: 1, letterSpacing: '1em' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-6xl md:text-9xl font-serif text-gold-400 uppercase font-bold"
              >
                Elysium
              </motion.h1>
            )}
            {textStage === 2 && (
              <motion.p
                key="subtitle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1 }}
                className="text-xl md:text-3xl font-sans text-white tracking-[0.5em] uppercase mt-4"
              >
                Beyond Beauty
              </motion.p>
            )}
          </AnimatePresence>
       </div>
    </motion.div>
  );
};

export default CinematicIntro;
