import React, { useEffect, useState } from "react";

const ParticleEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-500/40 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 20 + 10}s`
          }}
        />
      ))}
    </div>
  );
};

const StudentDiv: React.FC<{ name: string; role: string }> = ({ name, role }) => {
  return (
    <div className="relative overflow-hidden group flex flex-col justify-between backdrop-blur-md bg-white/5 border border-gray-500/10 p-6 rounded-xl hover:shadow-xl transition-all duration-500 transform hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/20 group-hover:to-blue-500/5 transition-all duration-700 ease-in-out transform-gpu"></div>
      <div className="absolute inset-0 bg-mesh-pattern opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <h3 className="mb-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 text-lg group-hover:animate-gradient-x">{name}</h3>
        <p className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">{role}</p>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-y-16 mx-auto px-8 py-12 sm:px-0 w-full max-w-7xl text-white overflow-hidden">
      <ParticleEffect />
      
      <div className={`flex flex-col gap-y-6 w-full text-center z-10 transition-all duration-700 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h1 className="font-bold text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 animate-gradient-x">About Us</h1>
        <p className="mx-auto max-w-3xl text-gray-300 text-lg sm:text-xl">
          Passionate innovators building tools to bring human motion to life.
        </p>
      </div>

      <div className={`flex flex-col justify-start gap-y-12 w-full max-w-6xl z-10 transition-all duration-700 delay-100 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center">
          <h2 className="mb-8 font-semibold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-200 animate-gradient-x">Meet Our Team</h2>
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StudentDiv name="Abdelrahman Emad" role="Artificial Intelligence Student" />
            <StudentDiv name="Ramez Ehab" role="Artificial Intelligence Student" />
            <StudentDiv name="Nader Maged" role="Artificial Intelligence Student" />
            <StudentDiv name="Saher Amr" role="Artificial Intelligence Student" />
          </div>
        </div>
      </div>

      <div className={`flex flex-col justify-center gap-y-8 max-w-4xl w-full z-10 transition-all duration-700 delay-200 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h2 className="font-semibold text-3xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-200 animate-gradient-x">Our Project</h2>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-xl shadow-lg hover:shadow-xl hover:border-white/20 transition-all duration-500 transform hover:scale-[1.02]">
          <div className="relative z-10">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              This project is part of our graduation requirements at Misr
              International University. It is designed to revolutionize the way
              motion capture is used by converting normal video recordings into
              animation-ready formats. This could potentially become a real-world
              software application used in gaming, film, virtual reality, and more.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our vision is to bridge the gap between video recordings and 3D
              animation by creating a simple, accessible, and powerful tool.
            </p>
          </div>
        </div>
      </div>

      <div className={`text-center mt-8 z-10 transition-all duration-700 delay-300 transform ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <p className="text-gray-400/80 text-sm backdrop-blur-sm bg-white/5 px-6 py-3 rounded-full inline-block hover:bg-white/10 hover:shadow-glow transition-all duration-300 transform hover:scale-105">
          Special thanks to Misr International University for their support and
          guidance throughout this journey.
        </p>
      </div>
      
      <div className="fixed inset-0 bg-gradient-radial from-purple-900/5 to-black/0 pointer-events-none"></div>
    </div>
  );
};

export default AboutPage;
