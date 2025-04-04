import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLocation, useParams } from "react-router-dom";

import BVHViewer from "@components/BVH/BVHViewer";
import { getProjectBVHFilenames } from "@/api/projectAPIs";
import useUserStore from "@/store/useUserStore";

const BVHScene: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [bvhUrlList, setBvhUrlList] = useState<string[]>([]);

  const location = useLocation();
  const { projectId } = useParams();
  const { user } = useUserStore();

  useEffect(() => {
    if (location.state) {
      const state = location.state;
      const updatedUrls = state.filenames_list.map(
        (fileName: string) => `http://127.0.0.1:5000/bvh/${fileName}`
      );
      setBvhUrlList(updatedUrls);
    } else {
      if (!projectId || !user?.id) return;



      getProjectBVHFilenames(projectId, user.id).then((response) => {
        if (response.success) {
          const updatedUrls = response.data.map(
            (fileName: string) => `http://127.0.0.1:5000/bvh/${fileName}`
          );
          setBvhUrlList(updatedUrls);
        } else {
          console.error("Error fetching BVH filenames:", response.data);
        }
      });
    }
  }, [location.state, projectId, user]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
  };

  const handleDurationScroll = (scrolling: boolean) => {
    setIsScrolling(scrolling);
  };

  return (
    <div className="flex lg:flex-row flex-col gap-x-4 gap-y-8 lg:gap-x-4 p-4 w-full h-min">
      <div className="border-4 border-black rounded-md w-full lg:w-2/3 h-[70vh] sm:h-[60vh]">
        <Canvas camera={{ position: [0, 100, 200], fov: 60 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          {bvhUrlList.map((url, index) => (
            <BVHViewer
              key={index}
              bvhUrl={url}
              isPlaying={isPlaying}
              currentTime={currentTime}
              onDurationSet={setDuration}
              onTimeUpdate={setCurrentTime}
              isScrolling={isScrolling}
            />
          ))}
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
              max={duration.toString()}
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


      </div>
    </div>
  );
};

export default BVHScene;
