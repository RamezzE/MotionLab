import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../../../api/videoAPIs";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const response = await uploadVideo(file, (progress) => {
      setProgress(progress);
    });

    if (response && response.success)
      console.log("Upload Response Data:", response);
    else console.error("Upload Error:", response);

  };

  return (
    <div className="flex flex-col justify-center items-center px-4 w-screen h-screen text-white">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-5xl">Upload Your MP4 File</h1>
        <p className="text-gray-300 text-lg">
          Upload your MP4 file to visualize 3D landmarks and animations.
        </p>
      </div>

      <div className="border-purple-600 bg-gray-800 shadow-lg p-6 border rounded-lg w-full max-w-md">
        <label
          htmlFor="file-upload"
          className="flex flex-col justify-center items-center border-2 border-purple-600 bg-gray-900 hover:bg-gray-800 border-dashed rounded-lg h-40 transition cursor-pointer"
        >
          {file ? (
            <p className="text-purple-400 text-sm">{file.name}</p>
          ) : (
            <>
              <svg
                className="mb-2 w-12 h-12 text-purple-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v1.25A2.25 2.25 0 005.25 20h13.5A2.25 2.25 0 0021 17.75V16.5M7.5 12l4.5 4.5m0 0l4.5-4.5m-4.5 4.5V3"
                ></path>
              </svg>
              <p className="text-gray-300 text-sm">
                Drag & drop your MP4 file here, or{" "}
                <span className="text-purple-400">browse</span>
              </p>
              <p className="mt-2 text-gray-500 text-xs">Supported format: MP4</p>
            </>
          )}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".mp4"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {progress > 0 && (
        <div className="mt-4 w-full max-w-md">
          <div className="bg-gray-900 rounded-lg h-4">
            <div
              className="bg-purple-600 rounded-lg h-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-center text-gray-300 text-sm">
            Upload Progress: {progress}%
          </p>
        </div>
      )}

      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleUpload}
          className="bg-purple-800 hover:bg-purple-600 px-6 py-3 rounded-md text-white transition duration-300"
        >
          Upload and Visualize
        </button>
        <button
          onClick={() => setFile(null)}
          className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-md text-gray-300 transition duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
