import React, { useState } from "react";
import { serverURL } from "@/api/config";
import FormButton from "@/components/UI/FormButton";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, SpotLight } from "@react-three/drei";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Vector3 } from 'three';

interface Props {
  filename: string;
  onClose: () => void;
}

function Model({ url }: { url: string }) {
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, scene);

  React.useEffect(() => {
    // Play the first animation if available
    if (animations.length > 0) {
      const action = actions[animations[0].name];
      if (action) {
        action.play();
      }
    }
  }, [animations, actions]);
  // @ts-expect-error
  return <primitive object={scene} />;
}

const DownloadRetargetedModal: React.FC<Props> = ({ filename, onClose }) => {
  const downloadUrl = `${serverURL}/retargeted_avatars/${filename}`;
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/75">
      <div className="bg-gray-800 p-6 rounded-lg w-full sm:w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-white text-xl text-center">🎉 Retargeting Complete</h2>
        
        <div className="flex flex-col gap-4">
          <div className="bg-black/50 p-4 rounded-lg">
            <div className="h-[300px]">
              <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
                <Environment preset="sunset" />
                {/* <SpotLight
                  position={[2, 3, 2]}
                  angle={0.4}
                  penumbra={0.8}
                  intensity={1.5}
                  castShadow
                  color="#ffffff"
                /> */}
                
                <Model url={downloadUrl} />
                <OrbitControls minDistance={1} maxDistance={10} />
              </Canvas>
            </div>
            <p className="mt-2 text-gray-400 text-sm text-center">
              Note: If you used high X or Y sensitivity, you may need to zoom out to view your avatar completely.
            </p>
          </div>

          <div className="flex justify-center">
            <a
              href={downloadUrl}
              download
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md font-semibold text-white transition"
            >
              Download Retargeted Avatar
            </a>
          </div>

          <div className="flex justify-center">
            <FormButton
              label="Close"
              onClick={onClose}
              theme="transparent"
              fullWidth={false}
              textSize="base"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadRetargetedModal;
