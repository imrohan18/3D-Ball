/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createGirdledSphereGeometry } from './utils/geometry';
import { createStitchTexture, createStitchAlphaMap, createLeatherNormalMap, createBrandingTexture, createLeatherColorMap, createRoughnessMap, createMetalnessMap, createAOMap } from './utils/textures';
import { ShoppingBag, User, ChevronLeft, ChevronRight, Play } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeColor, setActiveColor] = useState<'red' | 'white' | 'pink'>('red');
  
  // Refs for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    // 2. Lighting & Environment
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    
    const envScene = new THREE.Scene();
    const envLight = new THREE.PointLight(0xffffff, 2.0); // Drastically reduced to prevent white-out
    envLight.position.set(0, 10, 10);
    envScene.add(envLight);
    
    const envTarget = pmremGenerator.fromScene(envScene);
    scene.environment = envTarget.texture;

    // 3. Ball Modeling (4K Textures)
    const geometry = createGirdledSphereGeometry(1.3, 128);
    const stitchNormalMap = createStitchTexture();
    const stitchAlphaMap = createStitchAlphaMap();
    const leatherNormalMap = createLeatherNormalMap();
    const brandingTexture = createBrandingTexture();
    const leatherColorMap = createLeatherColorMap();
    const roughnessMap = createRoughnessMap();
    const metalnessMap = createMetalnessMap();
    const aoMap = createAOMap();

    // Ball Group for easier rotation management
    const ballGroup = new THREE.Group();
    scene.add(ballGroup);

    // MeshPhysicalMaterial with 4K Maps
    const material = new THREE.MeshPhysicalMaterial({
      color: "#ffffff", // Use map for color
      map: leatherColorMap,
      normalMap: leatherNormalMap,
      normalScale: new THREE.Vector2(0.5, 0.5),
      roughnessMap: roughnessMap,
      metalnessMap: metalnessMap,
      aoMap: aoMap,
      aoMapIntensity: 1.0,
      clearcoat: 0.3, 
      clearcoatRoughness: 0.3,
      sheen: 0.1,
      envMapIntensity: 0.2,
    });
    materialRef.current = material;

    const ball = new THREE.Mesh(geometry, material);
    ball.scale.set(0.5, 0.5, 0.5);
    ballGroup.add(ball);
    ballRef.current = ball;

    // Seam Layer (Raised Matte Textile)
    const seamMaterial = new THREE.MeshPhysicalMaterial({
      color: "#F5F5DC",
      roughness: 0.7,
      normalMap: stitchNormalMap,
      normalScale: new THREE.Vector2(2.5, 2.5),
      alphaMap: stitchAlphaMap,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });
    const seamMesh = new THREE.Mesh(geometry, seamMaterial);
    seamMesh.scale.set(1.008, 1.008, 1.008);
    ball.add(seamMesh);

    // Branding Decal (Gold Foil) - Rotated to face
    const brandingMaterial = new THREE.MeshPhysicalMaterial({
      map: brandingTexture,
      transparent: true,
      color: "#D4AF37",
      metalness: 1.0,
      roughness: 0.25,
      emissive: "#D4AF37",
      emissiveIntensity: 0.1,
      polygonOffset: true,
      polygonOffsetFactor: -3,
    });
    const brandingMesh = new THREE.Mesh(geometry, brandingMaterial);
    brandingMesh.rotation.x = -Math.PI / 2; // Move to leather face
    ball.add(brandingMesh);

    // Initial tilt to make logo face user
    ballGroup.rotation.x = 0.6;

    // 4. Animations
    gsap.from(ballGroup.scale, {
      x: 0, y: 0, z: 0,
      duration: 1.2,
      ease: "power3.out"
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!ballGroup) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      
      gsap.to(ballGroup.rotation, {
        x: y * 0.3 + 0.6, // Maintain tilt
        y: x * 0.3,
        duration: 1.2,
        ease: "power2.out"
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      
      // Constant rotation on the ball itself
      if (ball) {
        ball.rotation.y += 0.02;
      }
      
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
      renderer.dispose();
    };
  }, []);

  const changeBallColor = (colorType: 'red' | 'white' | 'pink') => {
    if (!materialRef.current || !ballRef.current) return;
    setActiveColor(colorType);

    let newValues;
    let targetScale = 0.5;
    let colorMap;

    if (colorType === 'red') {
      newValues = { color: "#ffffff", roughness: 0.5, metalness: 0.0, clearcoat: 0.3 };
      targetScale = 0.5;
      colorMap = createLeatherColorMap('#5A0A0A', '#2D0505');
    } else if (colorType === 'pink') {
      newValues = { color: "#ffffff", roughness: 0.45, metalness: 0.0, clearcoat: 0.25 };
      targetScale = 1.0;
      colorMap = createLeatherColorMap('#a34d6d', '#6d2e46');
    } else {
      newValues = { color: "#ffffff", roughness: 0.5, metalness: 0.0, clearcoat: 0.15 };
      targetScale = 1.0;
      colorMap = createLeatherColorMap('#e5e5e5', '#a3a3a3');
    }

    if (colorMap) {
      materialRef.current.map = colorMap;
      materialRef.current.needsUpdate = true;
    }

    gsap.to(ballRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 0.8,
      ease: "power2.inOut"
    });

    gsap.to(materialRef.current, {
      roughness: newValues.roughness,
      metalness: newValues.metalness,
      clearcoat: newValues.clearcoat,
      duration: 1,
      ease: "power2.inOut"
    });
  };

  const cycleColor = (direction: 'next' | 'prev') => {
    const colors: ('red' | 'white' | 'pink')[] = ['red', 'white', 'pink'];
    const currentIndex = colors.indexOf(activeColor);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % colors.length;
    } else {
      nextIndex = (currentIndex - 1 + colors.length) % colors.length;
    }
    changeBallColor(colors[nextIndex]);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-[#050505] text-white font-sans overflow-hidden select-none">
      {/* Background Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <h2 className="text-[25vw] font-black text-[#1a1a1a] tracking-tighter leading-none select-none">
          TURF
        </h2>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full px-12 py-8 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-4 h-1 bg-white" />
          </div>
          <span className="font-black text-xl tracking-tighter uppercase">Kookaburra</span>
        </div>
        
        <div className="hidden md:flex items-center gap-12 text-sm font-medium text-neutral-400">
          <a href="#" className="hover:text-white transition-colors">Products</a>
          <a href="#" className="hover:text-white transition-colors">Customize</a>
          <a href="#" className="hover:text-white transition-colors">Contacts</a>
        </div>

        <div className="flex items-center gap-6">
          <User size={20} className="text-neutral-400 hover:text-white cursor-pointer" />
          <ShoppingBag size={20} className="text-neutral-400 hover:text-white cursor-pointer" />
        </div>
      </nav>

      {/* Main 3D Canvas */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Promotion Video Button */}
      <div className="absolute top-1/3 left-12 z-20 flex items-center gap-4 group cursor-pointer">
        <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
          <Play size={16} fill="currentColor" />
        </div>
        <div className="text-xs font-bold tracking-widest text-neutral-500 group-hover:text-white transition-colors">
          PROMOTION<br/>VIDEO
        </div>
      </div>

      {/* Color Selectors (Left Side) */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-8">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => changeBallColor('red')}>
          <div className={`w-4 h-4 rounded-full transition-all ${activeColor === 'red' ? 'ring-2 ring-offset-2 ring-offset-black ring-white scale-125' : 'bg-[#4A0404] opacity-50 group-hover:opacity-100'}`} style={{ backgroundColor: '#4A0404' }} />
          <span className={`text-[10px] font-bold tracking-widest uppercase transition-all ${activeColor === 'red' ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-400'}`}>Red</span>
        </div>
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => changeBallColor('white')}>
          <div className={`w-4 h-4 rounded-full transition-all ${activeColor === 'white' ? 'ring-2 ring-offset-2 ring-offset-black ring-white scale-125' : 'bg-[#e5e5e5] opacity-50 group-hover:opacity-100'}`} style={{ backgroundColor: '#e5e5e5' }} />
          <span className={`text-[10px] font-bold tracking-widest uppercase transition-all ${activeColor === 'white' ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-400'}`}>White</span>
        </div>
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => changeBallColor('pink')}>
          <div className={`w-4 h-4 rounded-full transition-all ${activeColor === 'pink' ? 'ring-2 ring-offset-2 ring-offset-black ring-white scale-125' : 'bg-[#a34d6d] opacity-50 group-hover:opacity-100'}`} style={{ backgroundColor: '#a34d6d' }} />
          <span className={`text-[10px] font-bold tracking-widest uppercase transition-all ${activeColor === 'pink' ? 'text-white' : 'text-neutral-600 group-hover:text-neutral-400'}`}>Pink</span>
        </div>
      </div>

      {/* Bottom UI */}
      <div className="absolute bottom-12 left-0 w-full px-12 flex items-end justify-between z-20">
        <div className="space-y-1">
          <div className="text-5xl font-bold tracking-tight text-[#3b82f6]">$159.99</div>
          <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
            SIZE: <span className="text-white">156G</span> • OFFICIAL MATCH BALL
          </div>
        </div>

        <button className="px-12 py-4 bg-[#00bfff] text-black font-black text-sm tracking-widest uppercase hover:bg-[#0099cc] transition-all transform hover:scale-105 active:scale-95">
          Add to Cart
        </button>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => cycleColor('prev')}
            className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-neutral-900 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => cycleColor('next')}
            className="w-12 h-12 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-neutral-900 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Vertical Progress/Info */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4">
        <div className="h-32 w-px bg-neutral-800 relative">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-[#00bfff]" />
        </div>
        <div className="text-[10px] font-bold tracking-widest text-[#00bfff] rotate-90 origin-center whitespace-nowrap mt-8">
          90 / 10
        </div>
      </div>
    </div>
  );
}
