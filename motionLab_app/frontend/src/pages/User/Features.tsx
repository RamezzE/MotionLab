import React from "react";
import { Link } from "react-router-dom";
import FormButton from "@/components/UI/FormButton";

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: string;
}> = ({ title, description, icon }) => {
  return (
    <div className="relative group flex flex-col gap-y-4 backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl hover:shadow-xl transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      <div className="relative z-10">
        <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 w-12 h-12 flex items-center justify-center rounded-full text-2xl mb-2">{icon}</div>
        <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 text-lg">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const FeaturesPage = () => {
  return (
    <div className="flex flex-col items-center gap-y-16 px-8 py-12 max-w-7xl mx-auto w-full text-white">
      {/* Hero Section */}
      <div className="flex flex-col gap-y-6 max-w-3xl text-center">
        <h1 className="font-bold text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300">Features</h1>
        <p className="text-gray-300 text-lg">
          Discover how our platform transforms your videos into professional 3D animations
        </p>
      </div>

      {/* Main Features */}
      <div className="flex flex-col gap-y-12 w-full max-w-6xl">
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          <FeatureCard
            title="Video to BVH Conversion"
            description="Convert your 2D videos into industry-standard BVH motion files with high precision. Our advanced AI algorithms ensure accurate motion capture and smooth animations."
            icon="🎥"
          />
          <FeatureCard
            title="ReadyPlayerMe Integration"
            description="Create and customize your unique 3D avatar using ReadyPlayerMe's powerful platform. Export your avatar in GLB format for seamless integration."
            icon="👤"
          />
          <FeatureCard
            title="Motion Analysis"
            description="Our system analyzes human motion in your videos, detecting key points and movements to create accurate 3D animations."
            icon="📊"
          />
          <FeatureCard
            title="Export Options"
            description="Export your animations in multiple formats including BVH and GLB, compatible with major 3D software and game engines."
            icon="💾"
          />
        </div>
      </div>

      {/* Workflow Section */}
      <div className="flex flex-col gap-y-8 w-full max-w-4xl">
        <h2 className="font-semibold text-3xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-200">How It Works</h2>
        <div className="flex flex-col gap-y-8 backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-xl shadow-lg">
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-3">
              <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 w-10 h-10 flex items-center justify-center rounded-full font-bold">1</div>
              <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 text-xl">Upload Your Video</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed ml-14">
              Start by uploading your MP4 video file. We support videos up to 150MB in size and 1 minute in length.
            </p>
          </div>
          
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-3">
              <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 w-10 h-10 flex items-center justify-center rounded-full font-bold">2</div>
              <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 text-xl">Create Your Avatar</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed ml-14">
              Use ReadyPlayerMe to create and customize your 3D avatar. Choose from a wide range of customization options.
            </p>
          </div>
          
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-3">
              <div className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 w-10 h-10 flex items-center justify-center rounded-full font-bold">3</div>
              <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-300 text-xl">Process & Export</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed ml-14">
              Our system processes your video and generates a BVH motion file. You can then export your animation in your preferred format.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col gap-y-6 text-center backdrop-blur-md bg-white/5 border border-white/10 p-10 rounded-xl shadow-lg max-w-3xl w-full">
        <h2 className="font-semibold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-200">Ready to Get Started?</h2>
        <p className="text-gray-300 text-lg">
          Join us today and start creating professional 3D animations from your videos.
        </p>
        <div className="flex sm:flex-row flex-col justify-center items-center gap-4 mt-4">
          <Link
            to="/auth/signup"
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-lg text-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-blue-600/80 group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300"></span>
            <span className="relative flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Sign Up Now
            </span>
          </Link>
          
          <Link
            to="/upload"
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-lg border-2 border-purple-500/50 bg-transparent text-purple-100 transition duration-300 ease-out hover:border-purple-400"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/20 group-hover:to-blue-600/20 transition-all duration-300"></span>
            <span className="relative flex items-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try Now
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
