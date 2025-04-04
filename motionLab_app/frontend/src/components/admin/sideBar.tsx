import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SideBarProps {
    isOpen: boolean;
}

const SideBar = ({ isOpen }: SideBarProps) => {
    const location = useLocation();
    
    const isActive = (path: string) => {
        return location.pathname === path;
    };
    
    return (
        <div className={`fixed left-0 top-0 h-full bg-gray-900 text-white w-64 pt-16 z-0 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
            <div className="p-4">
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link 
                                to="/admin/dashboard" 
                                className={`flex items-center p-3 rounded-lg ${
                                    isActive("/admin/dashboard") 
                                        ? "bg-purple-600 text-white" 
                                        : "text-gray-300 hover:bg-gray-700"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/userManage" 
                                className={`flex items-center p-3 rounded-lg ${
                                    isActive("/admin/userManage") 
                                        ? "bg-purple-600 text-white" 
                                        : "text-gray-300 hover:bg-gray-700"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                User Management
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/projects" 
                                className={`flex items-center p-3 rounded-lg ${
                                    isActive("/admin/projects") 
                                        ? "bg-purple-600 text-white" 
                                        : "text-gray-300 hover:bg-gray-700"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                                Projects Overview
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/metrics" 
                                className={`flex items-center p-3 rounded-lg ${
                                    isActive("/admin/metrics") 
                                        ? "bg-purple-600 text-white" 
                                        : "text-gray-300 hover:bg-gray-700"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                System Metrics
                            </Link>
                        </li>
                        <li>
                            <Link 
                                to="/admin/logs" 
                                className={`flex items-center p-3 rounded-lg ${
                                    isActive("/admin/logs") 
                                        ? "bg-purple-600 text-white" 
                                        : "text-gray-300 hover:bg-gray-700"
                                }`}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Logs Viewer
                            </Link>
                        </li>
                    </ul>
                </nav>
                
                <div className="absolute bottom-0 left-0 w-full p-4">
                    <Link to="/" className="block w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-center text-white">
                        Return to Main Site
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
