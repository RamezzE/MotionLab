import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NotFoundPage = () => {
    const [animateIn, setAnimateIn] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setAnimateIn(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen w-full px-4 py-10">
            <div className={`backdrop-blur-md bg-black/30 rounded-2xl p-12 border border-gray-500/20 shadow-2xl flex flex-col items-center max-w-xl w-full transition-all duration-700 ${animateIn ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`}>
                <div className="bg-gradient-to-r from-purple-500/80 to-blue-500/80 text-white rounded-full p-5 mb-8 animate-pulse shadow-lg shadow-purple-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="mb-4 font-bold text-7xl md:text-9xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 animate-gradient-x">404</h1>
                <p className="mb-8 text-gray-100 text-xl md:text-2xl text-center transition-all duration-700 delay-300 transform-gpu" style={{ textShadow: '0 0 10px rgba(255,255,255,0.1)' }}>
                    Oops! The page you're looking for doesn't exist.
                </p>
                <Link
                    to="/"
                    className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full border-2 border-purple-500/50 bg-transparent text-purple-100 transition duration-300 ease-out hover:border-purple-400 hover:scale-105 transform-gpu"
                >
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50 group-hover:from-purple-600/80 group-hover:to-blue-600/80 transition-all duration-300"></span>
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 transition-transform duration-700 ease-in-out"></span>
                    <span className="relative flex items-center text-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:translate-x-[-2px] transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Return Home
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;