import React from "react";
import { serverURL } from "@/api/config";
import FormButton from "@/components/UI/FormButton";

interface Props {
  filename: string;
  onClose: () => void;
}

const DownloadRetargetedModal: React.FC<Props> = ({ filename, onClose }) => {
  const downloadUrl = `${serverURL}/retargeted_avatars/${filename}`;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60">
      <div className="space-y-6 bg-gray-900 shadow-lg p-6 border border-purple-600 rounded-xl w-full max-w-md text-white">
        <h2 className="font-bold text-2xl text-center">🎉 Retargeting Complete</h2>
        <p className="text-center">Your retargeted avatar is ready to download:</p>

        <div className="flex justify-center">
          <a
            href={downloadUrl}
            download
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md font-semibold transition"
          >
            Download {filename}
          </a>
        </div>

        <div className="flex justify-center">
          <FormButton label="Close" onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default DownloadRetargetedModal;
