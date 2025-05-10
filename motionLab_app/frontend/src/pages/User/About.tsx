import React from "react";

const StudentDiv: React.FC<{ name: string; role: string }> = ({ name, role }) => {
  return (
    <div className="relative overflow-hidden group flex flex-col justify-between backdrop-blur-md bg-white/5 border border-gray-500/10 p-6 rounded-xl hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <h3 className="mb-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 text-lg">{name}</h3>
        <p className="text-gray-300">{role}</p>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center gap-y-16 mx-auto px-8 py-12 sm:px-0 w-full max-w-7xl text-white">
      <div className="flex flex-col gap-y-6 w-full text-center">
        <h1 className="font-bold text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300">About Us</h1>
        <p className="mx-auto max-w-3xl text-gray-300 text-lg sm:text-xl">
          Passionate innovators building tools to bring human motion to life.
        </p>
      </div>

      <div className="flex flex-col justify-start gap-y-12 w-full max-w-6xl">
        <div className="text-center">
          <h2 className="mb-8 font-semibold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-200">Meet Our Team</h2>
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StudentDiv name="Abdelrahman Emad" role="Artificial Intelligence Student" />
            <StudentDiv name="Ramez Ehab" role="Artificial Intelligence Student" />
            <StudentDiv name="Nader Maged" role="Artificial Intelligence Student" />
            <StudentDiv name="Saher Amr" role="Artificial Intelligence Student" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-y-8 max-w-4xl w-full">
        <h2 className="font-semibold text-3xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-200">Our Project</h2>
        <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-xl shadow-lg">
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

      <div className="text-center mt-8">
        <p className="text-gray-400/80 text-sm backdrop-blur-sm bg-white/5 px-6 py-3 rounded-full inline-block">
          Special thanks to Misr International University for their support and
          guidance throughout this journey.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
