import React from "react";
import useUserStore from "@/store/useUserStore";
import { Link } from "react-router-dom";

const AdminProfile = () => {
    const { user } = useUserStore();

    if (!user) {
        return (
            <div className="p-6 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-200 mb-4">Not logged in</h1>
                    <p className="text-gray-400 mb-6">Please log in to view your profile</p>
                    <Link 
                        to="/login"
                        className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-8">
                Admin Profile
            </h1>

            <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">
                                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{user.first_name} {user.last_name}</h2>
                            <p className="text-purple-400">Administrator</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Email</h3>
                            <p className="text-white">{user.email}</p>
                        </div>
                        
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Account Type</h3>
                            <div className="flex items-center">
                                <span className="px-2 py-1 rounded-full bg-purple-600/20 text-purple-400 text-xs font-medium mr-2">
                                    Admin
                                </span>
                                <span className="text-white">Full administrative privileges</span>
                            </div>
                        </div>
                        
                        <div className="bg-gray-700/50 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Account Security</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-white">Password</span>
                                <Link 
                                    to="#" 
                                    className="text-sm text-purple-400 hover:text-purple-300"
                                >
                                    Change password
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <h3 className="text-lg font-medium text-white mb-4">Admin Dashboard</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Link 
                                to="/admin/dashboard" 
                                className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition"
                            >
                                <span className="block text-gray-300 text-sm">Dashboard</span>
                            </Link>
                            <Link 
                                to="/admin/userManage" 
                                className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition"
                            >
                                <span className="block text-gray-300 text-sm">Users</span>
                            </Link>
                            <Link 
                                to="/admin/projects" 
                                className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition"
                            >
                                <span className="block text-gray-300 text-sm">Projects</span>
                            </Link>
                            <Link 
                                to="/admin/logs" 
                                className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition"
                            >
                                <span className="block text-gray-300 text-sm">Logs</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile; 