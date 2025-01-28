import React from "react";

const AboutPage = () => {
  return (
    <div className="w-screen min-h-screen text-white flex flex-col items-center justify-start px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-gray-300">
          Passionate innovators building tools to bring human motion to life.
        </p>
      </div>

      <div className="w-full max-w-4xl text-center mb-12 flex-row items-center justify-center">
        <h2 className="text-3xl font-semibold mb-6">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Abdelrahman Emad</h3>
            <p className="text-gray-400">Artificial Intelligence Student</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Ramez Ehab</h3>
            <p className="text-gray-400">Artificial Intelligence Student</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Nader Maged</h3>
            <p className="text-gray-400">Artificial Intelligence Student</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold">Saher Amr</h3>
            <p className="text-gray-400">Artificial Intelligence Student</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl text-center">
        <h2 className="text-3xl font-semibold mb-6">Our Project</h2>
        <p className="text-lg text-gray-300 mb-6">
          This project is part of our graduation requirements at Misr
          International University. It is designed to revolutionize the way
          motion capture is used by converting normal video recordings into
          animation-ready formats. This could potentially become a real-world
          software application used in gaming, film, virtual reality, and more.
        </p>
        <p className="text-lg text-gray-300">
          Our vision is to bridge the gap between video recordings and 3D
          animation by creating a simple, accessible, and powerful tool.
        </p>
      </div>

      <div className="w-full max-w-4xl text-center mt-12">
        <p className="text-sm text-gray-500">
          Special thanks to Misr International University for their support and
          guidance throughout this journey.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
