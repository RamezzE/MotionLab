import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useGLTF, useAnimations } from "@react-three/drei";
import { Trash2 } from "lucide-react";
import { Vector3 } from 'three';
import LoadingSpinner from "@/components/UI/LoadingSpinner";

interface AvatarViewerProps {
    modelSrc: string;
    characterName: string;
    createdDate?: string; // formatted as a string (e.g., '2025-05-08')
    displayMode?: 'default' | 'list'; // New prop to determine the layout
    onPress?: (() => void) | null; // Edit handler
    onDelete?: (() => void) | null; // Delete handler
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

const AvatarViewer: React.FC<AvatarViewerProps> = ({
    modelSrc,
    characterName,
    createdDate,
    displayMode = 'default', // Default value is 'default'
    onPress = null,
    onDelete = null,
}) => {
    const [hasError, setHasError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        // Reset error state when modelSrc changes
        setHasError(false);
    }, [modelSrc]);

    const handleDelete = async () => {
        if (!onDelete) return;
        setIsDeleting(true);
        try {
            await onDelete();
        } finally {
            setIsDeleting(false);
        }
    };

    // Conditional classes for 'default' and 'list' display modes
    const containerClasses = displayMode === 'list'
        ? 'flex-row gap-x-4 max-w-[300px] hover:border-4 hover:border-blue-500 transition-all duration-300 relative border border-purple-600 h-full'  // Horizontal layout for list mode
        : 'flex-col justify-center w-full h-[50vh] xs:flex-row lg:flex-row'; // Flex-col for xs, flex-row for larger screens

    return (
        <div
            className={`flex bg-black/50 px-4 rounded-xl items-center hover:pointer ${containerClasses}`}
        >
            {/* Displaying the character name and created date */}
            <div className={displayMode === 'list' ? 'text-left cursor-pointer' : 'mt-4 text-left xs:w-[50%]'}
                onClick={displayMode === 'list' ? onPress ? onPress : undefined : undefined} // Only make it clickable in list mode
            >
                <h2 className={`font-semibold text-white text-2xl ${displayMode === 'list' ? 'mb-2' : ''}`}>
                    {characterName}
                </h2>
                {createdDate && (
                    <p className="text-gray-400 text-sm">
                        Created on: {new Date(createdDate).toLocaleDateString()}
                    </p>
                )}
            </div>

            <div
                className={`relative ${displayMode === 'list' ? 'w-[150px] h-[150px] cursor-pointer' : 'xs:w-[50%] lg:w-[50%] h-full'}`}
                onClick={displayMode === 'list' && onPress ? onPress : undefined}
            >
                <Canvas camera={{ position: [0, 0.5, 3], fov: 45 }}>
                    <Environment preset="sunset" />
                    <React.Suspense fallback={null}>
                        <ErrorBoundary onError={() => setHasError(true)}>
                            <Model url={modelSrc} />
                        </ErrorBoundary>
                    </React.Suspense>
                    <OrbitControls 
                        minDistance={1.5} 
                        maxDistance={5}
                        enableZoom={displayMode === 'default'}
                        enablePan={displayMode === 'default'}
                        enableRotate={displayMode === 'default'}
                        target={[0, 0, 0]}
                    />
                </Canvas>
                {hasError && (
                    <div className="absolute inset-0 flex justify-start items-center rounded-xl">
                        <p className="text-red-400 text-sm text-left">
                            Failed to load model
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Icon for list view */}
            {displayMode === 'list' && onDelete && (
                <div className="top-3 right-2 z-50 absolute flex gap-2">
                    {isDeleting ? (
                        <div className="text-gray-400">
                            <LoadingSpinner size={20} />
                        </div>
                    ) : (
                        <button
                            onClick={handleDelete}
                            className="text-gray-400 hover:text-red-500 hover:cursor-pointer"
                            aria-label="Delete Avatar"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

class ErrorBoundary extends React.Component<{ children: React.ReactNode; onError: () => void }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode; onError: () => void }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch() {
        this.props.onError();
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}

export default AvatarViewer;
