import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BVHLoader } from "three/examples/jsm/loaders/BVHLoader";

interface BVHViewerProps {
    bvhUrl?: string;
    isPlaying: boolean;
    currentTime: number;
    onDurationSet: (duration: number) => void;
    onTimeUpdate: (time: number) => void;
    isScrolling: boolean;
}

// Define the expected structure returned by the BVHLoader
interface BVHResult {
    clip: THREE.AnimationClip;
    skeleton: THREE.Skeleton;
}

const BVHViewer: React.FC<BVHViewerProps> = ({
    bvhUrl,
    isPlaying,
    currentTime,
    onDurationSet,
    onTimeUpdate,
    isScrolling,
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const skeletonHelperRef = useRef<THREE.SkeletonHelper | null>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const actionRef = useRef<THREE.AnimationAction | null>(null);
    const clock = useRef(new THREE.Clock());

    useEffect(() => {
        if (!bvhUrl) return;
        const loader = new BVHLoader();
        loader.load(
            bvhUrl,
            (result: BVHResult) => {
                // Create Skeleton Helper
                const skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0]);
                // skeletonHelper.skeleton = result.skeleton;
                

                // Customize the SkeletonHelper material for thicker bones
                skeletonHelper.material = new THREE.LineBasicMaterial({
                    color: 0x00ff00, // Green color for the bones
                    linewidth: 3, // Increase line thickness
                });
                skeletonHelperRef.current = skeletonHelper;

                // Create Bone Container and add the root bone
                const boneContainer = new THREE.Group();
                boneContainer.add(result.skeleton.bones[0]);

                // Scale the skeleton down
                const scale = 1;
                boneContainer.scale.set(scale, scale, scale);

                // Add to scene if groupRef is available
                if (groupRef.current) {
                    groupRef.current.add(skeletonHelper);
                    groupRef.current.add(boneContainer);
                }

                // Create Animation Mixer and clip action
                const mixer = new THREE.AnimationMixer(skeletonHelper);
                const action = mixer.clipAction(result.clip);
                action.setLoop(THREE.LoopOnce); // Play the animation only once
                action.clampWhenFinished = true; // Stop at the last frame when finished
                action.setEffectiveWeight(1.0).play();

                // Save references for later use
                mixerRef.current = mixer;
                actionRef.current = action;

                // Notify parent of the animation duration
                onDurationSet(result.clip.duration);
            },
            undefined,
            (error: Error | ErrorEvent) => {
                console.error("Error loading BVH file:", error);
            }
        );
    }, [bvhUrl, onDurationSet]);

    const resetAnimation = () => {
        if (actionRef.current && mixerRef.current) {
            actionRef.current.reset(); // Reset the animation action
            actionRef.current.time = 0; // Set animation time to the beginning
            mixerRef.current.update(0); // Reflect the reset immediately
        }
    };

    useFrame(() => {
        if (!mixerRef.current || !actionRef.current) return;

        const delta = clock.current.getDelta();

        if (isScrolling) {
            // During scrolling, update the animation time to match the slider
            actionRef.current.time = currentTime;
            mixerRef.current.update(0);
        } else if (isPlaying) {
            // Update the animation during playback
            mixerRef.current.update(delta);
            onTimeUpdate(actionRef.current.time);

            if (actionRef.current.time >= actionRef.current.getClip().duration) {
                // Reset animation when it reaches the end
                resetAnimation();
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* Grid Helper */}
            <gridHelper args={[200, 10]} />
        </group>
    );
};

export default BVHViewer;
