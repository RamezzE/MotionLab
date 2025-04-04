import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-5">
      <div className="max-w-md w-full bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-red-500/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-red-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-4 text-white">Access Denied</h1>
        
        <div className="bg-gray-700/60 p-4 rounded-lg mb-6">
          <p className="text-gray-200 text-center">
            You don't have the necessary permissions to access this area. This section is restricted to admin users only.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="flex items-center justify-center w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg transition duration-200"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            Return to Home
          </Link>
          
          <Link 
            to="/login" 
            className="flex items-center justify-center w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg border border-gray-600 transition duration-200"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
              />
            </svg>
            Log in with Different Account
          </Link>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>If you believe this is a mistake, please contact your system administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 