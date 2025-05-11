import React from "react";

interface SuccessMessageProps {
  message: string;
  className?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div className={`bg-green-500/20 shadow-lg shadow-green-500/20 p-3 border-2 border-green-500 rounded-lg ${className}`}>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <p className="font-medium text-green-400">{message}</p>
      </div>
    </div>
  );
};

export default SuccessMessage; 