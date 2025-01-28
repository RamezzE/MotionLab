import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import BVHViewer from "../../../components/BVH/BVHViewer";
import { useLocation } from "react-router-dom";

const BVHScene = () => {
  const [isPlaying, setIsPlaying] = useState(false); // Track animation state
  const [duration, setDuration] = useState(0); // Animation duration
  const [currentTime, setCurrentTime] = useState(0); // Current animation time
  const [isScrolling, setIsScrolling] = useState(false); // Track slider interaction
  const [bvhUrl, setBvhUrl] = useState(null); // BVH file URL
  
  const location = useLocation();

  useEffect(() => {
    if (location.state)
      setBvhUrl("http://127.0.0.1:5000/bvh/" + location.state.fileName);
    else {
      setBvhUrl("https://raw.githubusercontent.com/CreativeInquiry/BVH-Examples/master/example-threejs/bvh/Jackson.bvh");
    }
  }, [location.state]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev); // Toggle play/pause state
  };

  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value); // Update current time based on slider
    setCurrentTime(newTime); // Update the slider state
  };

  const handleDurationScroll = (isScrolling) => {
    setIsScrolling(isScrolling); // Update scrolling state
  };

  return (
    <div className="flex lg:flex-row flex-col gap-x-4 gap-y-8 lg:gap-x-4 p-4 w-full h-min">
      <div className="border-4 border-black rounded-md w-full lg:w-2/3 h-[70vh] sm:h-[60vh]">
        <Canvas camera={{ position: [0, 100, 200], fov: 60 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <BVHViewer
            bvhUrl={bvhUrl}
            isPlaying={isPlaying}
            currentTime={currentTime}
            onDurationSet={setDuration}
            onTimeUpdate={setCurrentTime}
            isScrolling={isScrolling}
          />
          {/* <BVHViewer
            bvhUrl={bvhUrl2}
            isPlaying={isPlaying}
            currentTime={currentTime}
            onDurationSet={setDuration}
            onTimeUpdate={setCurrentTime}
            isScrolling={isScrolling}
          /> */}
          <OrbitControls minDistance={50} maxDistance={300} />
        </Canvas>
      </div>

      <div className="flex flex-col gap-y-4 w-full lg:w-1/3">

            <h1 className="font-bold text-center text-white">Animation Controls</h1>

      {/* Play Pause Button & Slider */}
        <div className="flex flex-col items-center gap-y-2 w-full">
          <button
            onClick={togglePlayPause}
            className="z-10 bg-blue-500 p-2 rounded-md text-white"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          {/* Duration Scroller */}
          <div className="z-10 w-full">
            <input
              type="range"
              min="0"
              max={duration}
              step="0.01"
              value={currentTime}
              onChange={handleTimeChange}
              onMouseDown={() => handleDurationScroll(true)} // Start scrolling
              onMouseUp={() => handleDurationScroll(false)} // Stop scrolling
              onTouchStart={() => handleDurationScroll(true)} // Start scrolling on touch
              onTouchEnd={() => handleDurationScroll(false)} // Stop scrolling on touch
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-sm text-white">
              <span>{currentTime.toFixed(2)}s</span>
              <span>{duration.toFixed(2)}s</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BVHScene;