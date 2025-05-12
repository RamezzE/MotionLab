
import { useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

interface AvatarModelProps {
    url: string;
    isPlaying?: boolean | null;
    position?: [number, number, number] | null;
}


const AvatarModel = ({ url, isPlaying = true, position }: AvatarModelProps) => {
    const { scene, animations } = useGLTF(url);
    const { actions } = useAnimations(animations, scene);

    useEffect(() => {
        const action = animations.length > 0 ? actions[animations[0].name] : null;
        if (!action) return;

        if (isPlaying) {
            action.paused = false;
            action.play();
        } else {
            action.paused = true;
        }
    }, [isPlaying, actions, animations]);

    //   @ts-expect-error
    return <primitive object={scene} position={position} />;
};



export default AvatarModel;

