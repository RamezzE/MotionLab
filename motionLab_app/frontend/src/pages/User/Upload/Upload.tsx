import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { uploadVideo } from "@/api/videoAPIs";
import { validateProjectSettings } from "@/utils/validateProjectSettings";
import useUserStore from "@/store/useUserStore";

import UploadVideoSection from "./Sections/UploadVideoSection";
import UploadVideoSettingsSection from "./Sections/UploadVideoSettingsSection";

import { ProjectSettings } from "@/types/types";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import LoginGuard from "@/components/auth/LoginGuard";
import VerifyEmailGuard from "@/components/auth/VerifyEmailGuard";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [settings, setSettings] = useState<ProjectSettings>({
    projectName: "",
    xSensitivity: 0,
    ySensitivity: 0,
    stationary: true
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
    setLoading(true);
    setErrorMessage(null);
    setSettingsError(null);

    try {
      // Check if file exists
      if (!file) {
        setErrorMessage("Please select a file to upload");
        return;
      }

      // Validate project settings
      const settingsValidation = validateProjectSettings(settings);
      if (!settingsValidation.success) {
        setSettingsError(settingsValidation.error);
        return false;
      }

      // Check if user is logged in.
      if (!user || !user.id) {
        setErrorMessage("User ID is not available. Please log in.");
        navigate("/auth/login");
        return;
      }

      // Check if user's email is verified (skip for admin users).
      if (!user.is_email_verified && !user.is_admin) {
        setErrorMessage("Please verify your email before uploading.");
        return;
      }

      // Attempt to upload video
      const response = await uploadVideo(
        file,
        settings.projectName,
        user.id.toString(),
        settings.xSensitivity,
        settings.ySensitivity,
        (progressValue: number) => {
          setProgress(progressValue);
        }
      );

      if (response && response.success) {
        navigate(`/project/${response.data.projectId}`, {
          state: { filenames_list: response.data.bvh_filenames },
        });
      } else {
        console.error("Upload Error:", response);
        setErrorMessage(
          response.message || "An error occurred during the upload. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // If the user is not logged in, show a message and button to login.
  if (!user) {
    return (
      <LoginGuard
        title="Upload Your MP4 File"
      />
    );
  }

  // If user is logged in but email is not verified (and not an admin), show verification prompt.
  if (user && !user.is_email_verified && !user.is_admin) {
    return (
      <VerifyEmailGuard
        title="Upload Your MP4 File"
      />
    );
  }

  // Otherwise, show the upload interface.
  return (
    <div className="flex flex-col items-center gap-y-4">
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-white text-5xl">Upload Your MP4 File</h1>
        <p className="text-gray-300 text-lg">
          Upload your MP4 file to visualize 3D landmarks and animations.
        </p>
      </div>
      <div className="flex sm:flex-row flex-col-reverse justify-between items-start gap-y-8 sm:gap-y-0 px-4 w-full max-w-4xl h-full text-white">
        {
          loading ? (
            <div className="flex flex-col justify-center items-center w-full min-h-[40vh]">
              <LoadingSpinner size={125} />
              <p className="mt-6 font-bold text-gray-300 text-base text-center">
                Processing your video...
              </p>
            </div>
          ) : (
            <UploadVideoSection
              handleUpload={handleUpload}
              handleFileChange={handleFileChange}
              progress={progress}
              loading={loading}
              file={file}
            />
          )}

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