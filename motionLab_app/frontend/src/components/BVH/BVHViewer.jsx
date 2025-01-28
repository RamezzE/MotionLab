import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BVHLoader } from "three/examples/jsm/loaders/BVHLoader";


const BVHViewer = ({ bvhUrl = "", isPlaying, currentTime, onDurationSet, onTimeUpdate, isScrolling }) => {
    const groupRef = useRef();
    const skeletonHelperRef = useRef();
    const mixerRef = useRef();
    const actionRef = useRef();
    const clock = useRef(new THREE.Clock());

    useEffect(() => {
        const loader = new BVHLoader();
        loader.load(
            bvhUrl,
            (result) => {
                // Skeleton Helper
                const skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0]);
                skeletonHelper.skeleton = result.skeleton;

                // Customize the SkeletonHelper material for thicker bones
                skeletonHelper.material = new THREE.LineBasicMaterial({
                    color: 0x00ff00, // Green color for the bones
                    linewidth: 3, // Increase line thickness
                });
                skeletonHelperRef.current = skeletonHelper;

                // Bone Container
                const boneContainer = new THREE.Group();
                boneContainer.add(result.skeleton.bones[0]);

                // Scale the skeleton down
                boneContainer.scale.set(0.3, 0.3, 0.3); // Reduce the size (30% of original)

                // Add to scene
                groupRef.current.add(skeletonHelper);
                groupRef.current.add(boneContainer);

                // Animation Mixer
                const mixer = new THREE.AnimationMixer(skeletonHelper);
                const action = mixer.clipAction(result.clip);
                action.setLoop(THREE.LoopOnce); // Play the animation only once
                action.clampWhenFinished = true; // Stop at the last frame when the animation finishes
                action.setEffectiveWeight(1.0).play();

                // Save references
                mixerRef.current = mixer;
                actionRef.current = action;

                // Notify parent component of the animation duration
                onDurationSet(result.clip.duration);
            },
            undefined,
            (error) => {
                console.error("Error loading BVH file:", error);
            }
        );
    }, [onDurationSet]);

    const resetAnimation = () => {
        if (actionRef.current) {
            actionRef.current.reset(); // Reset the animation action
            actionRef.current.time = 0; // Set the animation time to the beginning
            mixerRef.current.update(0); // Ensure the reset is reflected immediately
        }
    };

    useFrame(() => {
        if (!mixerRef.current || !actionRef.current) return;

        const delta = clock.current.getDelta();

        if (isScrolling) {
            // During scrolling, update the animation time to match the slider
            actionRef.current.time = currentTime;
            mixerRef.current.update(0); // Update the animation      
        } else if (isPlaying) {
            // Update the animation during playback
            mixerRef.current.update(delta);
            onTimeUpdate(actionRef.current.time); // Update the current time

            if (actionRef.current.time >= actionRef.current.getClip().duration) {
                // Stop the animation when it reaches the end
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