import React from "react";

const FeaturesPage = () => {
  return (
    <div className="w-screen min-h-screen text-white flex flex-col items-center px-8 py-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Features & Guide</h1>
        <p className="text-lg text-gray-300">
          Learn how to use our platform and explore its powerful features to bring your animations to life.
        </p>
      </div>

      {/* Workflow Section */}
      <div className="w-full max-w-6xl text-center mb-16">
        <h2 className="text-3xl font-semibold mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold">Upload Your Video</h3>
            <p className="text-gray-400">
              Upload a bright and clear video for accurate landmark detection. Avoid low-light or blurry footage.
            </p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold">Check Skeleton</h3>
            <p className="text-gray-400">
              Verify the skeleton and landmarks. If something looks off, reupload the video for better accuracy.
            </p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold">Processing</h3>
            <p className="text-gray-400">
              Watch the real-time processing of your video as it generates a skeleton and animation data.
            </p>
          </div>
          {/* Step 4 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
              4
            </div>
            <h3 className="text-xl font-bold">Animate & Export</h3>
            <p className="text-gray-400">
              Add your models, smooth out frames, and export animation-ready files for Blender or other software.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full max-w-6xl text-center">
        <h2 className="text-3xl font-semibold mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Accurate Landmark Detection</h3>
            <p className="text-gray-400">
              State-of-the-art algorithms ensure precise detection of human landmarks and motion.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Real-Time Processing</h3>
            <p className="text-gray-400">
              Real-time video processing and visualization keep you in control of your animation creation.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Custom Animation Tools</h3>
            <p className="text-gray-400">
              Upload your own 3D models, smooth frames, and export animations in industry-standard formats.
            </p>
          </div>
          {/* Feature 4 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">User-Friendly Interface</h3>
            <p className="text-gray-400">
              Simple and intuitive UI designed to help you focus on creativity, not complexity.
            </p>
          </div>
          {/* Feature 5 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Blender Compatibility</h3>
            <p className="text-gray-400">
              Export animation-ready files for Blender and other popular 3D modeling software.
            </p>
          </div>
          {/* Feature 6 */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Robust Video Analysis</h3>
            <p className="text-gray-400">
              Analyze video for motion accuracy and make improvements before generating the final animation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
