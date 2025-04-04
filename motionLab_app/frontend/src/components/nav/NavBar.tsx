import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown } from "lucide-react"; // Import icons
import Logo from "/images/logo.png";

import useUserStore from "@/store/useUserStore";
import useProjectStore from "@/store/useProjectStore";

const NavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
    const { user, isAuthenticated, logout } = useUserStore();
    const { clearProjects } = useProjectStore();

    const navigate = useNavigate();

    const dropdownRef = useRef<HTMLDivElement>(null);

    const isAdmin = user?.is_admin || false;
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    // Get user initials for avatar display
    const getUserInitials = () => {
        if (!user) return "";
        return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    };
    

    const logoutFunc = () => {
        logout();
        clearProjects(); // Clear projects on logout
        setIsOpen(false); // Close the menu if it's open
        navigate("/"); // Redirect to home after logout
    }

    return (
        <nav className="flex justify-between items-center bg-gray-700 bg-opacity-50 shadow-lg mx-auto mt-4 px-6 sm:px-7 py-3 rounded-3xl w-[90%] md:max-w-4xl text-white">
            {/* Logo */}
            <div className="flex flex-col items-center space-y-1">
                <Link to="/">
                    <img src={Logo} alt="Logo" className="w-7 md:w-10 h-7 md:h-10" />
                </Link>
                <span className="font-bold text-slate-300 text-xs">
                    <Link to="/">MotionLab</Link>
                </span>
            </div>

            {/* Hamburger Icon (Visible on Small Screens) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden focus:outline-none text-white"
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4 md:space-x-12 font-medium text-sm md:text-base">
                <Link to="/about" className="hover:text-purple-400 transition duration-300">
                    About
                </Link>
                <Link to="/features" className="hover:text-purple-400 transition duration-300">
                    Features
                </Link>
                <Link to="/contact" className="hover:text-purple-400 transition duration-300">
                    Contact
                </Link>
                <Link to="/upload" className="hover:text-purple-400 transition duration-300">
                    Upload
                </Link>
            </div>

            {/* Desktop Auth Buttons & Profile Icon */}
            <div className="hidden md:flex items-center space-x-6 font-medium text-sm md:text-base">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="hover:text-purple-400 transition duration-300">
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white text-center transition duration-300"
                        >
                            <span className="flex flex-row">
                                Join<span className="hidden sm:block">&nbsp;Now</span>
                            </span>
                        </Link>
                    </>
                ) : (
                    <>
                        {/* Profile Icon with Dropdown for Admin Users */}
                        <div className="relative" ref={dropdownRef}>
                            {isAdmin ? (
                                <button
                                    onClick={toggleProfileDropdown}
                                    className="flex items-center space-x-1 hover:text-purple-400 transition duration-300"
                                >
                                    <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 rounded-full w-8 h-8">
                                        <span className="font-semibold text-white text-sm">{getUserInitials()}</span>
                                    </div>
                                    <ChevronDown size={16} />
                                </button>
                            ) : (
                                <Link
                                    to="/profile/projects"
                                    className="hover:text-purple-400 transition duration-300"
                                >
                                    <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 rounded-full w-8 h-8">
                                        <span className="font-semibold text-white text-sm">{getUserInitials()}</span>
                                    </div>
                                </Link>
                            )}

                            {/* Admin Dropdown Menu */}
                            {isAdmin && profileDropdownOpen && (
                                <div className="right-0 z-20 absolute bg-gray-800 shadow-lg mt-2 py-1 border border-gray-700 rounded-md w-48">
                                    <div className="px-4 py-2 border-gray-700 border-b">
                                        <p className="font-medium text-white text-sm">{user?.email}</p>
                                        <p className="font-medium text-purple-400 text-xs">Administrator</p>
                                    </div>
                                    <Link 
                                        to="/profile/projects" 
                                        className="block hover:bg-gray-700 px-4 py-2 text-gray-300 hover:text-white text-sm"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        Your Projects
                                    </Link>
                                    <Link 
                                        to="/admin/dashboard" 
                                        className="block hover:bg-gray-700 px-4 py-2 text-gray-300 hover:text-white text-sm"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        Admin Dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={logoutFunc}
                            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white text-center transition duration-300 hover:cursor-pointer"
                        >
                            Log Out
                        </button>
                    </>
                )}
            </div>

            {/* Mobile Menu (Dropdown) */}
            {isOpen && (
                <div className="md:hidden top-20 left-0 z-50 absolute flex flex-col items-center space-y-4 bg-gray-800 bg-opacity-95 py-6 w-full">
                    <Link
                        to="/about"
                        className="text-white hover:text-purple-400 transition duration-300"
                        onClick={() => setIsOpen(false)}
                    >
                        About
                    </Link>
                    <Link
                        to="/features"
                        className="text-white hover:text-purple-400 transition duration-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Features
                    </Link>
                    <Link
                        to="/contact"
                        className="text-white hover:text-purple-400 transition duration-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Contact
                    </Link>
                    <Link
                        to="/upload"
                        className="text-white hover:text-purple-400 transition duration-300"
                        onClick={() => setIsOpen(false)}
                    >
                        Upload
                    </Link>
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="text-white hover:text-purple-400 transition duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Log In
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white text-center transition duration-300 hover:cursor-pointer"
                                onClick={() => setIsOpen(false)}
                            >
                                Join Now
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/profile/projects"
                                className="flex items-center space-x-2 text-white hover:text-purple-400 transition duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                <User size={24} />
                                <span>Your Projects</span>
                            </Link>
                            {isAdmin && (
                                <Link
                                    to="/admin/dashboard"
                                    className="flex items-center space-x-2 text-white hover:text-purple-400 transition duration-300"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span>Admin Dashboard</span>
                                </Link>
                            )}
                            <button
                                onClick={logoutFunc}
                                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white text-center transition duration-300 hover:cursor-pointer"
                            >
                                Log Out
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default NavBar;
