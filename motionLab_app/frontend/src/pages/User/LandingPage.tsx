import React, { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations, Preload } from "@react-three/drei";
import { Link, useNavigate } from "react-router-dom";
import * as THREE from "three";
import FormButton from "@/components/UI/FormButton";

const ParticleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-500/40 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 20 + 10}s`
          }}
        />
      ))}
    </div>
  );
};

// Model Component
const Model: React.FC = () => {
  const { scene, animations } = useGLTF("/models/walking-man.glb");
  const { actions } = useAnimations(animations, scene);
  const modelRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.x = -4;
      modelRef.current.position.y = -1;
      modelRef.current.rotation.y = Math.PI / 2;
    }

    if (actions && animations[0]) {
      actions[animations[0].name]?.play();
    }
  }, [actions, animations]);

  // @ts-ignore
  return <primitive ref={modelRef} object={scene} scale={0.8} />;
};

// Floor Component Props
interface FloorProps {
  position: [number, number, number];
}

const Floor: React.FC<FloorProps> = ({ position }) => {
  const floorRef = useRef<THREE.Object3D>(null);
  const { scene } = useGLTF("/models/purple-floor.glb");

  useEffect(() => {
    if (floorRef.current) {
      floorRef.current.position.set(...position);
    }
  }, [position]);

  const clonedScene = scene.clone();
  // @ts-ignore
  return <primitive ref={floorRef} object={clonedScene} scale={1} />;
};

const FeatureHighlight: React.FC<{
  icon: string;
  title: string;
  description: string;
  index: number;
}> = ({ icon, title, description, index }) => {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100 + (index * 150));
    return () => clearTimeout(timer);
  }, [index]);
  
  return (
    <div 
      className={`relative group backdrop-blur-md bg-white/5 border border-white/10 p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      <div className="absolute inset-0 bg-mesh-pattern opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-xl"></div>
      <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 w-12 h-12 flex items-center justify-center rounded-full text-2xl mb-3 mx-auto group-hover:shadow-glow transition-all duration-500">{icon}</div>
      <h3 className="mb-2 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 text-center group-hover:animate-gradient-x">{title}</h3>
      <p className="text-gray-300 text-sm text-center group-hover:text-gray-100 transition-colors duration-300">{description}</p>
    </div>
  );
};

const StatBox: React.FC<{
  value: string;
  label: string;
  index: number;
}> = ({ value, label, index }) => {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 400 + (index * 100));
    return () => clearTimeout(timer);
  }, [index]);
  
  return (
    <div 
      className={`backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-xl hover:shadow-lg transition-all duration-500 transform group ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 text-2xl group-hover:animate-gradient-x">{value}</div>
      <div className="text-gray-300 text-sm group-hover:text-gray-100 transition-colors duration-300">{label}</div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  const floorPositions: [number, number, number][] = [
    // Main platform
    [-7, -1, 0], [-6, -1, 0], [-5, -1, 0], [-4, -1, 0], [-3, -1, 0], [-2, -1, 0], [-1, -1, 0],
    [0, -1, 0], [1, -1, 0], [2, -1, 0], [3, -1, 0], [4, -1, 0], [5, -1, 0], [6, -1, 0],
    
    // Left depth extensions
    [-7, -1, -1], [-7, -1, -2], [-7, -1, -3],
    [-6, -1, -1], [-6, -1, -2], [-6, -1, -3],
    [-5, -1, -1], [-5, -1, -2], [-5, -1, -3],
    [-4, -1, -1], [-4, -1, -2], [-4, -1, -3],
    [-3, -1, -1], [-3, -1, -2], [-3, -1, -3],
    [-2, -1, -1], [-2, -1, -2], [-2, -1, -3],
    [-1, -1, -1], [-1, -1, -2], [-1, -1, -3],
    
    // Middle depth extensions
    [0, -1, -1], [0, -1, -2], [0, -1, -3],
    [1, -1, -1], [1, -1, -2], [1, -1, -3],
    [2, -1, -1], [2, -1, -2], [2, -1, -3],
    [3, -1, -1], [3, -1, -2], [3, -1, -3],
    [4, -1, -1], [4, -1, -2], [4, -1, -3],
    [5, -1, -1], [5, -1, -2], [5, -1, -3],
    [6, -1, -1], [6, -1, -2], [6, -1, -3],
  ];

  return (
    <div className="relative flex flex-col flex-grow justify-evenly items-center px-4 py-10 md:py-0 w-full min-h-[90vh] overflow-hidden text-white">
      <ParticleBackground />
      
      {/* Hero Section */}
      <div className="z-10 px-4 max-w-5xl text-center relative">
        <div className={`transition-all duration-1000 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="inline-flex relative items-center mb-8 font-bold text-6xl md:text-7xl leading-tight">
            <span className="block left-0 absolute sm:relative bg-gradient-to-r from-purple-600/80 to-blue-500/80 mr-4 w-24 md:w-32 h-1 translate-x-[-50%] sm:translate-x-0"></span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 animate-gradient-x">Bring Human Motion to Life</span>
            <span className="block right-0 absolute sm:relative bg-gradient-to-r from-blue-500/80 to-purple-600/80 ml-4 w-24 md:w-32 h-1 translate-x-[50%] sm:translate-x-0"></span>
          </h1>
          <p className="mb-12 text-gray-300 text-xl md:text-2xl">
            Transform your videos into professional 3D animations with ReadyPlayerMe avatars
          </p>
        </div>
        
        {/* Feature Highlights */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-12">
          <FeatureHighlight 
            icon="🎥" 
            title="Video to BVH" 
            description="Convert 2D videos into industry-standard BVH motion files"
            index={0}
          />
          <FeatureHighlight 
            icon="👤" 
            title="ReadyPlayerMe" 
            description="Create and customize your unique 3D avatar"
            index={1}
          />
          <FeatureHighlight 
            icon="💾" 
            title="Blender Ready" 
            description="Export in BVH or GLB format for professional 3D workflows"
            index={2}
          />
        </div>

        <div className={`flex sm:flex-row flex-col justify-center sm:space-x-6 space-y-4 sm:space-y-0 transition-all duration-700 delay-500 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link
            to="/auth/signup"
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-lg text-lg transform hover:scale-105 transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-blue-600/80 group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 transition-transform duration-700 ease-in-out"></span>
            <span className="relative flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Get Started Free
            </span>
          </Link>
          <Link
            to="/features"
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-lg border-2 border-purple-500/50 bg-transparent text-purple-100 transition duration-300 ease-out hover:border-purple-400 transform hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:to-blue-600/20 transition-all duration-300"></span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-transform duration-700 ease-in-out"></span>
            <span className="relative flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn More
            </span>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="gap-4 grid grid-cols-2 md:grid-cols-4 mt-12 text-center relative">
          <StatBox value="150MB" label="Max Video Size" index={0} />
          <StatBox value="1 Min" label="Max Duration" index={1} />
          <StatBox value="BVH" label="Motion Format" index={2} />
          <StatBox value="GLB" label="Avatar Format" index={3} />
        </div>
      </div>

      {/* 3D Scene - Hidden on mobile */}
      <div className="hidden md:block top-0 left-0 absolute justify-center items-center w-full h-full pointer-events-none">
        <Canvas camera={{ position: [0, 1, 10], fov: 20 }} shadows>
          {/* @ts-ignore */}
          <ambientLight intensity={1} />
          {/* @ts-ignore */}
          <directionalLight position={[0, 3, 3]} intensity={2.5} />
          <Model />
          {/* {floorPositions.map((pos, index) => (
            <Floor key={index} position={pos} />
          ))} */}
          <Preload all />
        </Canvas>
      </div>
      
      <div className="fixed inset-0 bg-gradient-radial from-purple-900/5 to-black/0 pointer-events-none"></div>
    </div>
  );
};

export default LandingPage;
