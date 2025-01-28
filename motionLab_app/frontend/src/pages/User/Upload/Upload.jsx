import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload-bvh/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      if (response.status === 201) {
        alert(`File uploaded successfully: ${file.name}`);
        const filePath = response.data.file_path;

        // Redirect to BVHViewer with the file path as a query parameter
        navigate(`/bvh-viewer?file=${filePath}`);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      alert("An error occurred during the upload.");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-white px-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">Upload Your BVH File</h1>
        <p className="text-lg text-gray-300">
          Upload your BVH file to visualize 3D landmarks and animations.
        </p>
      </div>

      <div className="w-full max-w-md bg-gray-800 border border-purple-600 rounded-lg shadow-lg p-6">
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-purple-600 rounded-lg bg-gray-900 hover:bg-gray-800 cursor-pointer transition"
        >
          {file ? (
            <p className="text-sm text-purple-400">{file.name}</p>
          ) : (
            <>
              <svg
                className="w-12 h-12 mb-2 text-purple-400"
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
              <p className="text-sm text-gray-300">
                Drag & drop your BVH file here, or{" "}
                <span className="text-purple-400">browse</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">Supported format: BVH</p>
            </>
          )}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".bvh"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {progress > 0 && (
        <div className="w-full max-w-md mt-4">
          <div className="h-4 bg-gray-900 rounded-lg">
            <div
              className="h-full bg-purple-600 rounded-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-300 text-center mt-2">
            Upload Progress: {progress}%
          </p>
        </div>
      )}

      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleUpload}
          className="bg-purple-800 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition duration-300"
        >
          Upload and Visualize
        </button>
        <button
          onClick={() => setFile(null)}
          className="bg-gray-700 text-gray-300 px-6 py-3 rounded-md hover:bg-gray-600 transition duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UploadPage;
