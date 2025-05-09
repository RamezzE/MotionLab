import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUserStore from "@/store/useUserStore";

interface HeaderProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

const Header = ({ isSidebarOpen, toggleSidebar }: HeaderProps) => {
    const { user, logout } = useUserStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        logout();
        navigate("/auth/login");
    };

    // Get initials for the avatar
    const getInitials = () => {
        if (!user) return "A";
        return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);
        
        // Clean up
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="top-0 right-0 left-0 z-10 fixed bg-gray-900 shadow-md text-white">
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center">
                    <button 
                        onClick={toggleSidebar} 
                        className="hover:bg-gray-700 mr-4 p-2 rounded focus:outline-none text-white"
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
                        <span className="font-bold text-purple-400 text-2xl">MotionLab</span>
                        <span className="ml-2 text-gray-300 text-sm">Admin Panel</span>
                    </div>
                </div>
                
                <div className="flex items-center">
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={toggleDropdown}
                            className="flex items-center hover:bg-gray-700 p-2 rounded"
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen}
                        >
                            <span className="hidden md:block mr-2">
                                {user ? `${user.first_name} ${user.last_name}` : 'Admin'}
                            </span>
                            <div className="flex justify-center items-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full w-8 h-8">
                                <span className="font-semibold text-white">{getInitials()}</span>
                            </div>
                        </button>

                        {/* Dropdown menu */}
                        {dropdownOpen && (
                            <div 
                                className="right-0 z-20 absolute bg-gray-800 shadow-lg mt-2 py-1 border border-gray-700 rounded-md w-48"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu"
                            >
                                <div className="px-4 py-2 border-gray-700 border-b">
                                    <p className="font-medium text-white text-sm">{user?.email}</p>
                                    <p className="font-medium text-purple-400 text-xs">Admin</p>
                                </div>
                                <Link 
                                    to="/admin/profile" 
                                    className="block hover:bg-gray-700 px-4 py-2 text-gray-300 hover:text-white text-sm"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Your Profile
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="block hover:bg-gray-700 px-4 py-2 w-full text-gray-300 hover:text-white text-sm text-left"
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;