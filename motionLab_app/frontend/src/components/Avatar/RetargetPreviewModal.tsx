import React from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useGLTF, useAnimations } from "@react-three/drei";
import FormButton from '@/components/UI/FormButton';
import { X } from "lucide-react";

interface RetargetPreviewModalProps {
    modelSrc: string;
    characterName: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading: boolean;
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

    // @ts-expect-error - primitive is a valid JSX element in @react-three/fiber
    return <primitive object={scene} position={[0, -0.9, 0]} />;
}

const RetargetPreviewModal: React.FC<RetargetPreviewModalProps> = ({
    modelSrc,
    characterName,
    onConfirm,
    onCancel,
    loading,
}) => {
    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/90">
            <div className="bg-gray-800 p-6 border border-purple-500/20 rounded-lg w-full sm:w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto">

                <div className="flex flex-row justify-between items-center mb-4">
                    <div className="w-6" /> {/* Spacer for balance */}
                    <h2 className="font-bold text-white text-xl">Preview Selected Avatar</h2>
                    {!loading && (
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                    )}
                    {loading && (<div className="w-6" />)}
                </div>
                <div className="flex flex-col gap-4">
                    <div className="bg-black/50 p-4 border border-purple-500/10 rounded-lg">
                        <h3 className="mb-2 font-semibold text-white">{characterName}</h3>

                        <div className="w-full h-[300px]">
                            <Canvas camera={{ position: [0, 0.5, 3], fov: 45 }}>
                                <Environment preset="sunset" />
                                <Model url={modelSrc} />
                                <OrbitControls
                                    minDistance={1.5}
                                    maxDistance={5}
                                    enableZoom={true}
                                    enablePan={true}
                                    enableRotate={true}
                                    target={[0, 0, 0]}
                                />
                            </Canvas>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        {!loading && (
                            <FormButton
                                label="Cancel"
                                onClick={onCancel}
                                theme="transparent"
                                fullWidth={false}
                                textSize="base"
                                disabled={loading}
                            />
                        )}
                        <FormButton
                            label={loading ? "Retargeting..." : "Confirm Retargeting"}
                            onClick={onConfirm}
                            loading={loading}
                            theme="default"
                            fullWidth={false}
                            textSize="base"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RetargetPreviewModal; 