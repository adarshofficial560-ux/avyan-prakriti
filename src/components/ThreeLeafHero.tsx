'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface ThreeLeafHeroProps {
  className?: string;
  compact?: boolean;
}

export const ThreeLeafHero: React.FC<ThreeLeafHeroProps> = ({ className = '', compact = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 120;
    const height = container.clientHeight || (compact ? 120 : 260);

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, compact ? 4.5 : 5.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Main Leaf Group
    const leafGroup = new THREE.Group();
    leafGroupRef.current = leafGroup;
    scene.add(leafGroup);

    // Create Organic Leaf Shape
    const shape = new THREE.Shape();
    // Leaf base
    shape.moveTo(0, -1.8);
    // Right leaf curve
    shape.bezierCurveTo(1.4, -0.8, 1.6, 0.8, 0, 2.0);
    // Left leaf curve
    shape.bezierCurveTo(-1.6, 0.8, -1.4, -0.8, 0, -1.8);

    const extrudeSettings = {
      steps: 3,
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.05,
      bevelSegments: 4,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();

    // Custom Botanical Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x00F29D, // Neon Eco Green
      emissive: 0x054d33,
      emissiveIntensity: 0.4,
      roughness: 0.25,
      metalness: 0.2,
      wireframe: false,
    });

    const leafMesh = new THREE.Mesh(geometry, material);
    leafMesh.rotation.z = -0.2;
    leafGroup.add(leafMesh);

    // Vein Line / Stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.9, 0.08),
      new THREE.Vector3(0.05, -0.8, 0.1),
      new THREE.Vector3(0.02, 0.5, 0.09),
      new THREE.Vector3(0, 1.9, 0.07),
    ]);
    const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.04, 8, false);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x10B981,
      roughness: 0.4,
      metalness: 0.1,
    });
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    leafGroup.add(stemMesh);

    // Bio-luminescent Floating Eco Particles
    const particleCount = compact ? 25 : 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 4;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      particleSpeeds.push(0.005 + Math.random() * 0.015);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00F29D, 2.5, 20);
    pointLight.position.set(3, 4, 4);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0x06B6D4, 1.8, 20);
    backLight.position.set(-3, -2, -3);
    scene.add(backLight);

    // GSAP Float Physics & Rotation
    gsap.to(leafGroup.position, {
      y: 0.18,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    gsap.to(leafGroup.rotation, {
      y: 0.35,
      x: 0.15,
      duration: 3.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Mouse Micro-Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle interactive inertia
      if (leafGroupRef.current) {
        leafGroupRef.current.rotation.y += (mouseX * 0.8 - leafGroupRef.current.rotation.y) * 0.05;
        leafGroupRef.current.rotation.x += (-mouseY * 0.6 - leafGroupRef.current.rotation.x) * 0.05;
      }

      // Animate floating particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 2.5) {
          positions[i * 3 + 1] = -2.5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.08;

      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || (compact ? 120 : 260);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [compact]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden ${className}`}
    />
  );
};
