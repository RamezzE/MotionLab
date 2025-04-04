import React from "react";

interface HeaderProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Header = ({ isSidebarOpen, toggleSidebar }: HeaderProps) => {
    return (
        <header className="bg-gray-900 text-white shadow-md fixed top-0 left-0 right-0 z-10">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <button 
                        onClick={toggleSidebar} 
                        className="mr-4 text-white p-2 rounded hover:bg-gray-700 focus:outline-none"
                        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            {isSidebarOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                    
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-purple-400">MotionLab</span>
                        <span className="ml-2 text-sm text-gray-300">Admin Panel</span>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <div className="relative">
                        <button className="flex items-center p-2 rounded hover:bg-gray-700">
                            <span className="mr-2 hidden md:block">Admin</span>
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                                <span className="text-white font-semibold">A</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;