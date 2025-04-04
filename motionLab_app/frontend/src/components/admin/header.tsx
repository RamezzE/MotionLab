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
        navigate("/login");
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
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={toggleDropdown}
                            className="flex items-center p-2 rounded hover:bg-gray-700"
                            aria-haspopup="true"
                            aria-expanded={dropdownOpen}
                        >
                            <span className="mr-2 hidden md:block">
                                {user ? `${user.first_name} ${user.last_name}` : 'Admin'}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-semibold">{getInitials()}</span>
                            </div>
                        </button>

                        {/* Dropdown menu */}
                        {dropdownOpen && (
                            <div 
                                className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-700"
                                role="menu"
                                aria-orientation="vertical"
                                aria-labelledby="user-menu"
                            >
                                <div className="px-4 py-2 border-b border-gray-700">
                                    <p className="text-sm text-white font-medium">{user?.email}</p>
                                    <p className="text-xs text-purple-400 font-medium">Admin</p>
                                </div>
                                <Link 
                                    to="/admin/profile" 
                                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                    onClick={() => setDropdownOpen(false)}
                                >
                                    Your Profile
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
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