import React from "react";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import Particles from "react-tsparticles";

const ParticlesBackground = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      className="absolute top-0 left-0 w-full h-full"
      options={{
        particles: {
          color: {
            value: "#ffffff",
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 50,
          },
          size: {
            value: 2,
          },
        },
        fullScreen: false,
      }}
    />
  );
};

export default ParticlesBackground;
