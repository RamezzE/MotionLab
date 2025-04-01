import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { uploadVideo } from "@/api/videoAPIs";
import { validateProjectSettings } from "@/utils/validateProjectSettings";
import useUserStore from "@/store/useUserStore";

import UploadVideoSection from "./Sections/UploadVideoSection";
import UploadVideoSettingsSection from "./Sections/UploadVideoSettingsSection";

import { ProjectSettings } from "@/types/types";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [settings, setSettings] = useState<ProjectSettings>({
    peopleCount: "single",
    outputFormat: "bvh",
    projectName: "",
  });

  const [settingsError, setSettingsError] = useState<string | null>(null);
  const { user } = useUserStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      console.error("No file selected.");
    }
    setProgress(0);
    setLoading(false);
  };

  const handleUpload = async (): Promise<void | boolean> => {
    setErrorMessage(null);
    setSettingsError(null);
    if (!file) {
      setErrorMessage("Please select a file to upload");
      return;
    }

    const settingsValidation = validateProjectSettings(settings);
    if (!settingsValidation.success) {
      setSettingsError(settingsValidation.error);
      return false;
    }

    if (!user || !user.id) {
      setErrorMessage("User ID is not available. Please log in.");
      return;
    }

    // Delay loading indicator by 1.5 seconds
    setTimeout(() => {
      setLoading(true);
    }, 1500);
    try {
      const response = await uploadVideo(
        file,
        settings.projectName,
        user.id,
        (progressValue: number) => {
          setProgress(progressValue);
        }
      );

      setLoading(false);

      if (response && response.success) {
        navigate(`/project/${response.data.projectId}`, {
          state: { filenames_list: response.data.bvh_filenames },
        });
      } else {
        console.error("Upload Error:", response);
      }
    }
    catch (error) {
      console.error("Upload Error:", error);
      setErrorMessage("An error occurred during the upload. Please try again.");
      setLoading(false);
    }
    finally {
      setProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-y-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-white text-5xl">Upload Your MP4 File</h1>
        <p className="text-gray-300 text-lg">
          Upload your MP4 file to visualize 3D landmarks and animations.
        </p>
      </div>
      <div className="flex sm:flex-row flex-col-reverse justify-between items-start gap-y-8 sm:gap-y-0 px-4 w-full max-w-4xl h-full text-white">

        <UploadVideoSection
          handleUpload={handleUpload}
          handleFileChange={handleFileChange}
          progress={progress}
          loading={loading}
          file={file}
        />

        <UploadVideoSettingsSection
          settings={settings}
          setSettings={setSettings}
          error={settingsError}
          loading={loading}
        />
      </div>

      {errorMessage && (
        <p className="mt-6 text-red-500 text-sm">{errorMessage}</p>
      )}
    </div>
  );
};

export default UploadPage;
