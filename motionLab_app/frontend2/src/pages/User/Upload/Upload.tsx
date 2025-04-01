import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../../../api/videoAPIs";
import UploadVideoSection from "./Sections/UploadVideoSection";
import UploadVideoSettingsSection from "./Sections/UploadVideoSettingsSection";
import { validateProjectSettings } from "../../../utils/validateProjectSettings";
import useUserStore from "../../../store/useUserStore";

interface ProjectSettings {
  peopleCount: string;
  outputFormat: string;
  projectName: string;
}

interface UploadResponseData {
  projectId: string;
  bvh_filenames: string[];
}

interface UploadResponse {
  success: boolean;
  data: UploadResponseData;
  error?: string;
}

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const [settings, setSettings] = useState<ProjectSettings>({
    peopleCount: "single",
    outputFormat: "bvh",
    projectName: "",
  });

  const [settingsError, setSettingsError] = useState<string | null>(null);
  const { user } = useUserStore();

  // Extend the change event to ensure files is defined
  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (event: FileChangeEvent): void => {
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
    if (!file) {
      alert("Please select a file to upload.");
      console.log("No file selected.");
      return;
    }

    const settingsValidation = validateProjectSettings(settings);
    if (!settingsValidation.success) {
      setSettingsError(settingsValidation.error);
      return false;
    }

    if (!user || !user.id) {
      alert("User ID not found.");
      return;
    }

    // Delay loading indicator by 1.5 seconds
    setTimeout(() => {
      setLoading(true);
    }, 1500);

    const response: UploadResponse = await uploadVideo(
      file,
      settings.projectName,
      user.id,
      (progressValue: number) => {
        setProgress(progressValue);
      }
    );

    setLoading(false);

    if (response && response.success) {
      console.log("Upload Response Data:", response);
      navigate(`/project/${response.data.projectId}`, {
        state: { filenames_list: response.data.bvh_filenames },
      });
    } else {
      console.error("Upload Error:", response);
    }
  };

  return (
    <div className="flex sm:flex-row flex-col-reverse justify-between items-center gap-y-8 sm:gap-y-0">
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
  );
};

export default UploadPage;
