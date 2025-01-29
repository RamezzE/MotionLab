import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Link } from "react-router-dom";

const Model = () => {
  const { scene, animations } = useGLTF("/models/walking-man.glb");
  const { actions } = useAnimations(animations, scene);
  const modelRef = useRef();

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

const Floor = ({ position }) => {
  const floorRef = useRef();
  const { scene } = useGLTF("/models/purple-floor.glb");

  useEffect(() => {
    if (floorRef.current) {
      floorRef.current.position.set(...position);
    }
  }, [position]);

  const clonedScene = scene.clone();

  return <primitive ref={floorRef} object={clonedScene} scale={1} />;
};


const LandingPage = () => {
  const floorPositions = [
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
    <div className="w-screen flex flex-col items-center justify-evenly flex-grow px-4 py-10 min-h-[80vh] md:py-0 text-white relative overflow-hidden">
      <div className="text-center px-4 z-10">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight inline-flex items-center">
          <span className="block absolute sm:relative left-0 translate-x-[-50%] sm:translate-x-0 bg-purple-600 h-1 w-24 md:w-32 mr-4"></span>
          Bring Human Motion to Life
          <span className="block absolute sm:relative right-0 translate-x-[50%] sm:translate-x-0 bg-purple-600 h-1 w-24 md:w-32 ml-4"></span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12">
          Efficient, accurate, and automated animation from simple video inputs
        </p>
        <div className="flex space-x-6 justify-center">
          <Link
            to="/signup"
            className="bg-purple-800 text-white px-8 py-4 rounded-md hover:bg-purple-600 hover:shadow-none transition duration-300 text-lg shadow-md shadow-slate-900"
          >
            Join Now
          </Link>

          <button className="border-2 text-white px-8 py-4 rounded-md hover:bg-purple-600 hover:border-purple-600 hover:shadow-none transition duration-300 text-lg shadow-md">
            View Demo
          </button>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex justify-center items-center">
        <Canvas camera={{ position: [0, 1, 10], fov: 20 }} shadows>
          <ambientLight intensity={1} />
          <directionalLight position={[0, 3, 3]} intensity={2.5} />

          <Model />

          {floorPositions.map((pos, index) => (
            <Floor key={index} position={pos} />
          ))}
        </Canvas>
      </div>
    </div>
  );
};

export default LandingPage;
