import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLocation, useParams } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import BVHViewer from "@components/BVH/BVHViewer";
import FormButton from "@/components/UI/FormButton";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

import { getProjectBVHFilenames } from "@/api/projectAPIs";
import useUserStore from "@/store/useUserStore";

import { serverURL } from "@/api/config";
import { Eye, EyeOff } from "lucide-react";

import useProjectStore from "@/store/useProjectStore";
import useAvatarStore from "@/store/useAvatarStore";

import DownloadRetargetedModal from "@/components/Avatar/DownloadRetargetedModal";
import RetargetPreviewModal from "@/components/Avatar/RetargetPreviewModal";

const BVHScene: React.FC = () => {
  const [downloadModalFilename, setDownloadModalFilename] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [retargeting, setRetargeting] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [bvhUrlList, setBvhUrlList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [bvhVisibility, setBvhVisibility] = useState<boolean[]>([]);

  const [selectedBVH, setSelectedBVH] = useState<string | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const { createRetargetedAvatar } = useProjectStore();
  const { avatars, fetchAvatars } = useAvatarStore();

  const location = useLocation();
  const { projectId } = useParams();
  const { user } = useUserStore();

  const toggleVisibility = (index: number) => {
    setBvhVisibility((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchAvatars(user.id.toString());
  }, [user]);

  useEffect(() => {
    try {
      setLoading(true)
      if (location.state) {
        const state = location.state;
        const updatedUrls = state.filenames_list.map(
          (fileName: string) => `${serverURL}/bvh/${fileName}`
        );
        setBvhUrlList(updatedUrls);
        setBvhVisibility(new Array(updatedUrls.length).fill(true));
      } else {
        if (!projectId || !user?.id) return;

        getProjectBVHFilenames(projectId, user.id.toString()).then((response) => {
          if (response.success) {
            const updatedUrls = response.data.map(
              (fileName: string) => `${serverURL}/bvh/${fileName}`
            );
            setBvhUrlList(updatedUrls);
            setBvhVisibility(new Array(updatedUrls.length).fill(true)); // ✅ add this line
          } else {
            console.error("Error fetching BVH filenames:", response.data);
          }
        });

      }
    }
    catch (error) {
      console.error("Error fetching BVH filenames:", error);
    }
    finally {
      setLoading(false);
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

  const downloadBVHFiles = async () => {
    if (bvhUrlList.length === 1) {
      // If only one file, download it directly.
      const url = bvhUrlList[0];
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}`);
        }
        const blob = await response.blob();
        const filename = url.substring(url.lastIndexOf("/") + 1);
        saveAs(blob, filename);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    } else {
      // Otherwise, zip multiple files.
      const zip = new JSZip();
      await Promise.all(
        bvhUrlList.map(async (url) => {
          try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}`);
            }
            const blob = await response.blob();
            const filename = url.substring(url.lastIndexOf("/") + 1);
            zip.file(filename, blob);
          } catch (error) {
            console.error("Error downloading file:", error);
          }
        })
      );
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "BVHFiles.zip");
      });
    }
  };

  const handleRetargetClick = () => {
    if (!projectId || !user?.id || !selectedBVH || !selectedAvatarId) {
      alert("Please select a BVH and an Avatar.");
      return;
    }
    setShowPreviewModal(true);
  };

  const handleConfirmRetarget = async () => {
    if (!projectId || !user?.id || !selectedBVH || !selectedAvatarId) return;

    try {
      setRetargeting(true);
      const res = await createRetargetedAvatar(projectId, user.id.toString(), selectedBVH, selectedAvatarId);
      if (res.success) {
        setShowPreviewModal(false);
        // @ts-expect-error
        setDownloadModalFilename(res.filename);
      } else {
        alert("❌ Failed to create retargeted avatar.");
      }
    } catch (err) {
      console.error("Error during retargeting:", err);
      alert("❌ An unexpected error occurred.");
    } finally {
      setRetargeting(false);
    }
  };

  const handleCancelRetarget = () => {
    setShowPreviewModal(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center w-full min-h-[40vh]">
        <LoadingSpinner size={125} />
      </div>
    );
  }

  return (
    <>
      <div className="flex lg:flex-row flex-col gap-x-4 gap-y-8 lg:gap-x-4 p-4 w-full h-min">
        <div className="border-4 border-black rounded-md w-full lg:w-2/3 h-[70vh] sm:h-[60vh]">
          <Canvas camera={{ position: [0, 100, 200], fov: 60 }}>
            {/* <ambientLight intensity={0.8} /> */}
            {/* <directionalLight position={[10, 10, 10]} intensity={1} /> */}
            {bvhUrlList.map((url, index) =>
              bvhVisibility[index] ? (
                <BVHViewer
                  key={index}
                  bvhUrl={url}
                  isPlaying={isPlaying}
                  currentTime={currentTime}
                  onDurationSet={setDuration}
                  onTimeUpdate={setCurrentTime}
                  isScrolling={isScrolling}
                />
              ) : null
            )}

            <OrbitControls minDistance={10} maxDistance={300} />
          </Canvas>
        </div>

        <div className="flex flex-col gap-y-4 w-full lg:w-1/3">
          <h1 className="font-bold text-white text-center">Visibility Controls</h1>

          <div className="flex flex-wrap justify-center gap-2">
            {bvhUrlList.map((_, index) => (
              <div
                key={index}
                className={`flex items-center gap-1  px-2 py-1 border border-purple-600 rounded-md text-white ${bvhVisibility[index] ? "bg-black/50" : "bg-gray-600 text-white/50"}`}
              >
                BVH {index + 1}
                <button onClick={() => toggleVisibility(index)} className="hover:text-purple-600 cursor-pointer">
                  {bvhVisibility[index] ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            ))}
          </div>
          <h1 className="font-bold text-white text-center">Animation Controls</h1>

          {/* Play/Pause Button & Slider */}
          <div className="flex flex-col items-center gap-y-4 w-full">
            <FormButton
              label={isPlaying ? "Pause" : "Play"}
              className="z-10 p-2 rounded-md max-w-min text-white"
              onClick={togglePlayPause}
              disabled={bvhUrlList.length === 0}
            />

            {bvhUrlList.length === 0 && (
              <p className="text-red-500 text-sm">No BVH files available.</p>
            )}

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

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-white">Choose BVH File:</label>
                <select
                  className="bg-gray-800 mt-1 p-2 rounded-md w-full text-white"
                  onChange={(e) => setSelectedBVH(e.target.value)}
                  value={selectedBVH ?? ""}
                >
                  <option value="">Select BVH</option>
                  {bvhUrlList.map((url) => {
                    const filename = url.split("/").pop();
                    return (
                      <option key={filename} value={filename}>
                        {filename}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-white">Choose Avatar:</label>
                <select
                  className="bg-gray-800 mt-1 p-2 rounded-md w-full text-white"
                  onChange={(e) => setSelectedAvatarId(e.target.value)}
                  value={selectedAvatarId ?? ""}
                >
                  <option value="">Select Avatar</option>
                  {avatars.map((avatar) => (
                    <option key={avatar.id} value={avatar.id}>
                      {avatar.name}
                    </option>
                  ))}
                </select>
              </div>

              <FormButton
                label={retargeting ? "Retargeting..." : "Retarget Avatar"}
                loading={retargeting}
                onClick={handleRetargetClick}
                disabled={!selectedBVH || !selectedAvatarId || retargeting}
              />
            </div>

            {/* Download BVH Files Button */}
            <FormButton
              label="Download BVH File(s)"
              className="z-10 rounded-md max-w-min text-white whitespace-nowrap"
              onClick={downloadBVHFiles}
              disabled={bvhUrlList.length === 0}
            />
          </div>
        </div>
      </div>


      {showPreviewModal && selectedAvatarId && (
        <RetargetPreviewModal
          modelSrc={`${serverURL}/avatars/${avatars.find(a => a.id.toString() === selectedAvatarId.toString())?.filename}`}
          characterName={avatars.find(a => a.id.toString() === selectedAvatarId.toString())?.name || ""}
          onConfirm={handleConfirmRetarget}
          onCancel={handleCancelRetarget}
          loading={retargeting}
        />
      )}

      {downloadModalFilename && (
        <DownloadRetargetedModal
          filename={downloadModalFilename}
          onClose={() => setDownloadModalFilename(null)}
        />
      )}
    </>
  );
};

export default BVHScene;