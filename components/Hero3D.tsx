import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    // Fog for depth
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Gold material for particles
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0xD4AF37, // Gold
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Geometric Floating Shape (Icosahedron)
    const geoGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const geoMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xD4AF37, 
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const geoMesh = new THREE.Mesh(geoGeometry, geoMaterial);
    scene.add(geoMesh);

    // Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
        requestAnimationFrame(animate);

        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        // Smooth rotation based on mouse
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        geoMesh.rotation.x += 0.002;
        geoMesh.rotation.y += 0.002;

        // Parallax feel
        particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

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
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (containerRef.current) {
            containerRef.current.removeChild(renderer.domElement);
        }
        // Cleanup geometry/materials
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        geoGeometry.dispose();
        geoMaterial.dispose();
    };
  }, []);

  return (
    <div 
        ref={containerRef} 
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
        style={{ background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)' }}
    />
  );
};

export default Hero3D;