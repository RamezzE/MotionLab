import React from "react";

const StudentDiv: React.FC<{ name: string; role: string }> = ({ name, role }) => {
  return (
    <div className="flex flex-col justify-between bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg hover:scale-105 transition-transform duration-300 transform">
      <h3 className="mb-2 font-bold text-purple-400 text-lg">{name}</h3>
      <p className="text-gray-300">{role}</p>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center gap-y-16 mx-auto px-8 sm:px-0 w-screen sm:w-[90vw] text-white">
      <div className="flex flex-col gap-y-6 w-full text-center">
        <h1 className="font-bold text-5xl md:text-6xl">About Us</h1>
        <p className="mx-auto max-w-3xl text-gray-300 text-lg sm:text-xl">
          Passionate innovators building tools to bring human motion to life.
        </p>
      </div>

      <div className="flex flex-col justify-start gap-y-12 w-full max-w-6xl">
        <div className="text-center">
          <h2 className="mb-8 font-semibold text-3xl">Meet Our Team</h2>
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StudentDiv name="Abdelrahman Emad" role="Artificial Intelligence Student" />
            <StudentDiv name="Ramez Ehab" role="Artificial Intelligence Student" />
            <StudentDiv name="Nader Maged" role="Artificial Intelligence Student" />
            <StudentDiv name="Saher Amr" role="Artificial Intelligence Student" />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-y-8 max-w-4xl">
        <h2 className="font-semibold text-3xl text-center">Our Project</h2>
        <div className="flex flex-col gap-y-6 bg-gray-800/30 backdrop-blur-sm p-8 rounded-lg">
          <p className="text-gray-300 text-lg leading-relaxed">
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

      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Special thanks to Misr International University for their support and
          guidance throughout this journey.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
