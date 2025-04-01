import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Link } from "react-router-dom";
import * as THREE from "three";

// Model Component
const Model: React.FC = () => {
  // Type the GLTF result; adjust additional properties as needed.
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

  return <primitive ref={modelRef} object={scene} scale={0.8} />;
};

// Floor Component Props
interface FloorProps {
  position: [number, number, number];
}

const Floor: React.FC<FloorProps> = ({ position }) => {
  const floorRef = useRef<THREE.Object3D>(null);
  // Load the floor model; type as GLTF.
  const { scene } = useGLTF("/models/purple-floor.glb");

  useEffect(() => {
    if (floorRef.current) {
      floorRef.current.position.set(...position);
    }
  }, [position]);

  // Clone the scene to avoid mutating the original loaded GLTF
  const clonedScene = scene.clone();

  return <primitive ref={floorRef} object={clonedScene} scale={1} />;
};

const LandingPage: React.FC = () => {
  // Define floorPositions as an array of [x, y, z] tuples.
  const floorPositions: [number, number, number][] = [
    [-4, -1, 0],
    [-3, -1, 0],
    [-2, -1, 0],
    [-1, -1, 0],
    [0, -1, 0],
    [1, -1, 0],
    [2, -1, -1],
    [2, -1, -2],
    [2, -1, -3],
    [3, -1, 0],
    [3, -1, -1],
    [3, -1, -2],
    [3, -1, -3],
    [4, -1, 0],
    [4, -1, -1],
    [4, -1, -2],
    [4, -1, -3],
  ];

  return (
    <div className="relative flex flex-col flex-grow justify-evenly items-center px-4 py-10 md:py-0 w-screen min-h-[80vh] overflow-hidden text-white">
      <div className="z-10 px-4 text-center">
        <h1 className="inline-flex relative items-center mb-6 font-bold text-6xl md:text-7xl leading-tight">
          <span className="block left-0 absolute sm:relative bg-purple-600 mr-4 w-24 md:w-32 h-1 translate-x-[-50%] sm:translate-x-0"></span>
          Bring Human Motion to Life
          <span className="block right-0 absolute sm:relative bg-purple-600 ml-4 w-24 md:w-32 h-1 translate-x-[50%] sm:translate-x-0"></span>
        </h1>
        <p className="mb-12 text-gray-300 text-xl md:text-2xl">
          Efficient, accurate, and automated animation from simple video inputs
        </p>
        <div className="flex justify-center space-x-6">
          <Link
            to="/signup"
            className="bg-purple-800 hover:bg-purple-600 shadow-md shadow-slate-900 hover:shadow-none px-8 py-4 rounded-md text-white text-lg transition duration-300"
          >
            Join Now
          </Link>
          <button className="hover:bg-purple-600 shadow-md hover:shadow-none px-8 py-4 border-2 hover:border-purple-600 rounded-md text-white text-lg transition duration-300">
            View Demo
          </button>
        </div>
      </div>

      <div className="top-0 left-0 absolute flex justify-center items-center w-full h-full pointer-events-none">
        <Canvas camera={{ position: [0, 1, 10], fov: 20 }} shadows>
          <ambientLight intensity={1} />
          <directionalLight position={[0, 3, 3]} intensity={2.5} />
          <Model />
          {floorPositions.map((pos, index) => (
            <Floor key={index} position={pos} />
          ))}
          {/* Enable orbit controls */}
          {/* If you want to use OrbitControls, import from '@react-three/drei' */}
        </Canvas>
      </div>
    </div>
  );
};

export default LandingPage;
