import React from "react";
import { Link } from "react-router-dom";
import FormButton from "@/components/UI/FormButton";

const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: string;
}> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col gap-y-4 bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg hover:scale-105 transition-transform duration-300 transform">
      <div className="text-purple-400 text-2xl">{icon}</div>
      <h3 className="font-semibold text-purple-400 text-lg">{title}</h3>
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

const FeaturesPage = () => {
  return (
    <div className="flex flex-col items-center gap-y-16 px-8 w-screen text-white">
      {/* Hero Section */}
      <div className="flex flex-col gap-y-6 max-w-3xl text-center">
        <h1 className="font-bold text-5xl md:text-6xl">Features</h1>
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
        <h2 className="font-semibold text-3xl text-center">How It Works</h2>
        <div className="flex flex-col gap-y-6 bg-gray-800/30 backdrop-blur-sm p-8 rounded-lg">
          <div className="flex flex-col gap-y-4">
            <h3 className="font-semibold text-purple-400 text-xl">1. Upload Your Video</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Start by uploading your MP4 video file. We support videos up to 150MB in size and 1 minute in length.
            </p>
          </div>
          <div className="flex flex-col gap-y-4">
            <h3 className="font-semibold text-purple-400 text-xl">2. Create Your Avatar</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Use ReadyPlayerMe to create and customize your 3D avatar. Choose from a wide range of customization options.
            </p>
          </div>
          <div className="flex flex-col gap-y-4">
            <h3 className="font-semibold text-purple-400 text-xl">3. Process & Export</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our system processes your video and generates a BVH motion file. You can then export your animation in your preferred format.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col gap-y-6 text-center">
        <h2 className="font-semibold text-3xl">Ready to Get Started?</h2>
        <p className="text-gray-300 text-lg">
          Join us today and start creating professional 3D animations from your videos.
        </p>
        <div className="flex sm:flex-row flex-col justify-center items-center gap-4">
          <Link
            to="/auth/signup"
            className="bg-purple-800 hover:bg-purple-600 shadow-md shadow-slate-900 hover:shadow-none px-8 py-4 rounded-md text-white text-lg transition duration-300"
          >
            Sign Up Now
          </Link>
          <Link
            to="/upload"
            className="hover:bg-purple-600 shadow-md hover:shadow-none px-8 py-4 border-2 hover:border-purple-600 rounded-md text-white text-lg transition duration-300"
          >
            Try Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
