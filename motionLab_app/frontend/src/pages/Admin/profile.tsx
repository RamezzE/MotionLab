import useUserStore from "@/store/useUserStore";
import { Link } from "react-router-dom";

const AdminProfile = () => {
    const { user } = useUserStore();

    if (!user) {
        return (
            <div className="flex justify-center items-center p-6 min-h-screen">
                <div className="text-center">
                    <h1 className="mb-4 font-bold text-gray-200 text-2xl">Not logged in</h1>
                    <p className="mb-6 text-gray-400">Please log in to view your profile</p>
                    <Link 
                        to="/auth/login"
                        className="inline-block bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 p-6 min-h-screen">
            <h1 className="bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 mb-8 font-bold text-transparent text-white text-3xl">
                Admin Profile
            </h1>

            <div className="bg-gray-800 shadow-xl mx-auto rounded-xl max-w-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center space-x-6 mb-8">
                        <div className="flex justify-center items-center bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full w-20 h-20">
                            <span className="font-bold text-white text-3xl">
                                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h2 className="font-bold text-white text-2xl">{user.first_name} {user.last_name}</h2>
                            <p className="text-purple-400">Administrator</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h3 className="mb-2 font-medium text-gray-400 text-sm">Email</h3>
                            <p className="text-white">{user.email}</p>
                        </div>
                        
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h3 className="mb-2 font-medium text-gray-400 text-sm">Account Type</h3>
                            <div className="flex items-center">
                                <span className="bg-purple-600/20 mr-2 px-2 py-1 rounded-full font-medium text-purple-400 text-xs">
                                    Admin
                                </span>
                                <span className="text-white">Full administrative privileges</span>
                            </div>
                        </div>
                        
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                            <h3 className="mb-2 font-medium text-gray-400 text-sm">Account Security</h3>
                            <div className="flex justify-between items-center">
                                <span className="text-white">Password</span>
                                <Link 
                                    to="#" 
                                    className="text-purple-400 hover:text-purple-300 text-sm"
                                >
                                    Change password
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-gray-700 border-t">
                        <h3 className="mb-4 font-medium text-white text-lg">Admin Dashboard</h3>
                        <div className="gap-4 grid grid-cols-2 sm:grid-cols-4">
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