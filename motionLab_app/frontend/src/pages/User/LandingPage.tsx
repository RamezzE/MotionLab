import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Link, useNavigate } from "react-router-dom";
import * as THREE from "three";
import FormButton from "@/components/UI/FormButton";

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

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="relative flex flex-col flex-grow justify-evenly items-center px-4 py-10 md:py-0 w-screen min-h-[90vh] overflow-hidden text-white">
      {/* Hero Section */}
      <div className="z-10 px-4 max-w-5xl text-center">
        <h1 className="inline-flex relative items-center mb-6 font-bold text-6xl md:text-7xl leading-tight">
          <span className="block left-0 absolute sm:relative bg-purple-600 mr-4 w-24 md:w-32 h-1 translate-x-[-50%] sm:translate-x-0"></span>
          Bring Human Motion to Life
          <span className="block right-0 absolute sm:relative bg-purple-600 ml-4 w-24 md:w-32 h-1 translate-x-[50%] sm:translate-x-0"></span>
        </h1>
        <p className="mb-8 text-gray-300 text-xl md:text-2xl">
          Transform your videos into professional 3D animations with ReadyPlayerMe avatars
        </p>
        
        {/* Feature Highlights */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3 mb-12">
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="mb-2 font-semibold text-purple-400">Video to BVH</h3>
            <p className="text-gray-300 text-sm">Convert 2D videos into industry-standard BVH motion files</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="mb-2 font-semibold text-purple-400">ReadyPlayerMe</h3>
            <p className="text-gray-300 text-sm">Create and customize your unique 3D avatar</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="mb-2 font-semibold text-purple-400">Blender Ready</h3>
            <p className="text-gray-300 text-sm">Export in BVH or GLB format for professional 3D workflows</p>
          </div>
        </div>

        <div className="flex sm:flex-row flex-col justify-center sm:space-x-6 space-y-4 sm:space-y-0">
          <Link
            to="/auth/signup"
            className="bg-purple-800 hover:bg-purple-600 shadow-md shadow-slate-900 hover:shadow-none px-8 py-4 rounded-md text-white text-lg transition duration-300"
          >
            Get Started Free
          </Link>
          <Link
            to="/features"
            className="hover:bg-purple-600 shadow-md hover:shadow-none px-8 py-4 border-2 hover:border-purple-600 rounded-md text-white text-lg transition duration-300"
          >
            Learn More
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="gap-4 grid grid-cols-2 md:grid-cols-4 mt-12 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg">
            <div className="font-bold text-purple-400 text-2xl">150MB</div>
            <div className="text-gray-300 text-sm">Max Video Size</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg">
            <div className="font-bold text-purple-400 text-2xl">1 Min</div>
            <div className="text-gray-300 text-sm">Max Duration</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg">
            <div className="font-bold text-purple-400 text-2xl">BVH</div>
            <div className="text-gray-300 text-sm">Motion Format</div>
          </div>
          <div className="bg-gray-800/30 backdrop-blur-sm p-4 rounded-lg">
            <div className="font-bold text-purple-400 text-2xl">GLB</div>
            <div className="text-gray-300 text-sm">Avatar Format</div>
          </div>
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
        </Canvas>
      </div>
    </div>
  );
};

export default LandingPage;
