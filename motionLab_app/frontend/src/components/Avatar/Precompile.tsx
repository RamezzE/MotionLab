import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";

const Precompile = () => {
  const { gl, scene, camera } = useThree();

  useLayoutEffect(() => {
    gl.compile(scene, camera);           // GPU shader precompilation
    gl.render(scene, camera);            // triggers material compilation immediately
  }, [gl, scene, camera]);

  return null;
};

export default Precompile;
