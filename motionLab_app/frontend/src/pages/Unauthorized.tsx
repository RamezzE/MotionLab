import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ParticleEffect: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 opacity-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-500/30 rounded-full animate-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 20 + 10}s`
          }}
        />
      ))}
    </div>
  );
};

const Unauthorized: React.FC = () => {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen w-full p-5 overflow-hidden">
      <ParticleEffect />
      
      <div className={`backdrop-blur-xl bg-black/20 shadow-2xl rounded-2xl p-10 border border-gray-500/30 max-w-md w-full z-10 transition-all duration-700 ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`}>
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-red-500/30 to-orange-500/30 p-5 rounded-full animate-pulse shadow-lg shadow-red-500/20">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-16 h-16 text-red-300" 
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
        
        <h1 className="mb-4 font-bold text-white text-3xl text-center bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-orange-300 animate-gradient-x">Access Denied</h1>
        
        <div className="backdrop-blur-md bg-gray-500/10 mb-8 p-5 rounded-xl border border-gray-500/20 hover:border-gray-400/30 transition-all duration-300 hover:shadow-lg">
          <p className="text-gray-100 text-center leading-relaxed">
            You don't have the necessary permissions to access this area. This section is restricted to admin users only.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            to="/" 
            className="group relative flex justify-center items-center overflow-hidden rounded-xl w-full p-3 transition-all duration-300 transform hover:scale-105"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600/60 to-blue-600/60 group-hover:from-purple-600/80 group-hover:to-blue-600/80 transition-all duration-300"></span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 transition-transform duration-500 ease-in-out"></span>
            <span className="relative flex items-center font-medium text-white">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mr-2 w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-300" 
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
            </span>
          </Link>
          
          <Link 
            to="/auth/login" 
            className="group relative flex justify-center items-center overflow-hidden rounded-xl w-full p-3 border border-gray-500/30 transition-all duration-300 hover:border-gray-400/40 transform hover:scale-105"
          >
            <span className="absolute inset-0 bg-gray-500/10 group-hover:bg-gray-500/20 transition-all duration-300"></span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-gray-500 to-gray-600 transition-opacity duration-500"></span>
            <span className="relative flex items-center font-medium text-gray-100">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="mr-2 w-5 h-5 group-hover:translate-x-[-2px] transition-transform duration-300" 
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
            </span>
          </Link>
        </div>
        
        <div className="mt-8 text-gray-400/80 text-sm text-center">
          <p>If you believe this is a mistake, please contact your system administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 