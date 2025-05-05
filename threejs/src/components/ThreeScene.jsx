import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/Addons.js';
import './ThreeScene.css';

const ThreeScene = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const width = 900;
    const height = 900;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2f2f2f); // Dark grey
 

    // const BG = new THREE.TextureLoader();
    // BG.load('textures/g.jpg' , function(texture)
    //             {
    //             scene.background = texture;  
    //             });


    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 5);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(width, height);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 10, 5);
    scene.add(dirLight);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('/textures/a.jpg');


    // Ground (optional)
    const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30), // Plane size
    new THREE.MeshStandardMaterial({
        map: texture,  // This is where the texture is used
        side: THREE.DoubleSide, // Make sure it's visible from both sides
        transparent: true, // Enable transparency if needed
    })
    );

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Load GLB model
    const loader = new GLTFLoader();
    loader.load(
      '/models/c.glb', // 👈 your file path here
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(3, 3, 3); // Adjust scale as needed
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error('Error loading .glb model:', error);
      }
    );

    // Load FBX model
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
    '/models/cottage_fbx.fbx', // Update the path to your FBX file
    (object) => {
        object.position.set(0, 0, 0); // Adjust position if needed
        object.scale.set(0.005, 0.005, 0.005); // Adjust scale as needed
        scene.add(object);
    },
    undefined,
    (error) => {
        console.error('Error loading .fbx model:', error);
    }
    );


    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="three-canvas" />
    </div>
  );
};

export default ThreeScene;
