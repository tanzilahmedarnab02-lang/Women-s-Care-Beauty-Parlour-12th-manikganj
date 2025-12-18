import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ServiceOrb: React.FC<{ active: boolean }> = ({ active }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);

    // Geometry
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xD4AF37,
      shininess: 100,
      specular: 0xffffff,
      wireframe: false
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient);

    camera.position.z = 30;

    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Rotate based on active state
      const speed = active ? 0.02 : 0.005;
      torusKnot.rotation.x += speed;
      torusKnot.rotation.y += speed;
      
      // Pulse scale
      const scale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
      torusKnot.scale.set(scale, scale, scale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [active]);

  return <div ref={mountRef} className="w-[300px] h-[300px] mx-auto opacity-80" />;
};

export default ServiceOrb;