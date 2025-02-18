import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BVHViewer from "../../../components/BVH/BVHViewer";
import { useLocation, useParams } from "react-router-dom";
import { getProjectBVHFilenames } from "../../../api/projectAPIs";
import useUserStore from "../../../store/useUserStore";

const BVHScene = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [bvhUrlList, setBvhUrlList] = useState([]);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });

  const location = useLocation();
  const { projectId } = useParams();
  const { user } = useUserStore();

  useEffect(() => {
    if (location.state) {
      const updatedUrls = location.state.filenames_list.map(
        (fileName) => `http://127.0.0.1:5000/bvh/${fileName}`
      );
      setBvhUrlList(updatedUrls);    }
    else {
      getProjectBVHFilenames(projectId, user.id).then((response) => {
        if (response.success) {
          const updatedUrls = response.filenames.map(
            (fileName) => `http://127.0.0.1:5000/bvh/${fileName}`
          );
          setBvhUrlList(updatedUrls);
        } else {
          console.error("Error fetching BVH filenames:", response.data);
        }
      });
      // setBvhUrl("https://raw.githubusercontent.com/CreativeInquiry/BVH-Examples/master/example-threejs/bvh/Jackson.bvh");
    }
  }, [location.state]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const handleDurationScroll = (isScrolling) => {
    setIsScrolling(isScrolling);
  };

  return (
    <div className="flex lg:flex-row flex-col gap-x-4 gap-y-8 lg:gap-x-4 p-4 w-full h-min">
      <div className="border-4 border-black rounded-md w-full lg:w-2/3 h-[70vh] sm:h-[60vh]">
        <Canvas camera={{ position: [0, 100, 200], fov: 60 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          {bvhUrlList.map((url, index) => {
            return (
              <BVHViewer
                key={index}
                bvhUrl={url}
                isPlaying={isPlaying}
                currentTime={currentTime}
                onDurationSet={setDuration}
                onTimeUpdate={setCurrentTime}
                isScrolling={isScrolling}
                rotation={rotation}
              />
            );
          })}

          <OrbitControls minDistance={10} maxDistance={300} />
        </Canvas>
      </div>

      <div className="flex flex-col gap-y-4 w-full lg:w-1/3">
        <h1 className="font-bold text-white text-center">Animation Controls</h1>

        {/* Play/Pause Button & Slider */}
        <div className="flex flex-col items-center gap-y-2 w-full">
          <button
            onClick={togglePlayPause}
            className="z-10 bg-blue-500 p-2 rounded-md text-white"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <div className="z-10 w-full">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.01"
              value={currentTime}
              onChange={handleTimeChange}
              onMouseDown={() => handleDurationScroll(true)}
              onMouseUp={() => handleDurationScroll(false)}
              onTouchStart={() => handleDurationScroll(true)}
              onTouchEnd={() => handleDurationScroll(false)}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-white text-sm">
              <span>{currentTime.toFixed(2)}s</span>
              <span>{duration.toFixed(2)}s</span>
            </div>
          </div>
        </div>

        {/* Rotation Controls */}
        <div className="bg-gray-800 p-4 rounded-md">
          <h2 className="font-semibold text-white text-center">Rotation Controls</h2>

          <label className="text-white">X Rotation: {rotation.x.toFixed(1)}°</label>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={rotation.x}
            onChange={(e) => setRotation({ ...rotation, x: parseFloat(e.target.value) })}
            className="w-full"
          />

          <label className="text-white">Y Rotation: {rotation.y.toFixed(1)}°</label>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={rotation.y}
            onChange={(e) => setRotation({ ...rotation, y: parseFloat(e.target.value) })}
            className="w-full"
          />

          <label className="text-white">Z Rotation: {rotation.z.toFixed(1)}°</label>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={rotation.z}
            onChange={(e) => setRotation({ ...rotation, z: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default BVHScene;
