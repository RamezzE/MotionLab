import React from "react";

const StudentDiv: React.FC<{ name: string; role: string }> = ({ name, role }) => {
  return (
    <div className="flex flex-col justify-between bg-gray-800 shadow-md mx-auto p-6 rounded-lg text-center">
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray-400">{role}</p>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center gap-y-12 mx-auto px-8 sm:px-0 w-screen sm:w-[90vw] text-white">
      <div className="flex flex-col gap-y-4 w-full text-center">
        <h1 className="font-bold text-5xl">About Us</h1>
        <p className="text-gray-300 text-sm sm:text-lg">
          Passionate innovators building tools to bring human motion to life.
        </p>
      </div>

      <div className="flex flex-col justify-start gap-y-8 w-full max-w-6xl text-center">
        <h2 className="font-semibold text-3xl text-center">Meet Our Team</h2>
        <div className="flex sm:flex-row flex-col justify-between gap-x-4 gap-y-4">
          <StudentDiv name="Abdelrahman Emad" role="Artificial Intelligence Student" />
          <StudentDiv name="Ramez Ehab" role="Artificial Intelligence Student" />
          <StudentDiv name="Nader Maged" role="Artificial Intelligence Student" />
          <StudentDiv name="Saher Amr" role="Artificial Intelligence Student" />
        </div>
      </div>

      <div className="flex flex-col justify-center gap-y-8 max-w-6xl text-center">
        <h2 className="font-semibold text-3xl">Our Project</h2>
        <div className="flex flex-col gap-y-4 sm:p-4 rounded-lg text-gray-300 text-lg">
          <p>
            This project is part of our graduation requirements at Misr
            International University. It is designed to revolutionize the way
            motion capture is used by converting normal video recordings into
            animation-ready formats. This could potentially become a real-world
            software application used in gaming, film, virtual reality, and more.
          </p>
          <p className="text-gray-300 text-lg">
            Our vision is to bridge the gap between video recordings and 3D
            animation by creating a simple, accessible, and powerful tool.
          </p>
        </div>

      </div>

      <div className="w-full max-w-6xl text-center">
        <p className="text-gray-300 text-sm">
          Special thanks to Misr International University for their support and
          guidance throughout this journey.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
