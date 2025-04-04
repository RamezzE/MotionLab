import React, { useState, useEffect } from "react";
import { getAllUsers, updateUser, deleteUser } from "@/api/adminAPIs";
import { User } from "@/api/adminAPIs";

interface UserFormData {
    first_name: string;
    last_name: string;
    email: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        first_name: "",
        last_name: "",
        email: ""
    });

    // Fetch users from API
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllUsers();
            if (response.success && response.data) {
                setUsers(response.data);
                // Check if the response message indicates mock data
                if (response.message && (response.message.includes("mock") || response.message.includes("development"))) {
                    setUsingMockData(true);
                } else {
                    setUsingMockData(false);
                }
            } else {
                setError(response.message || "Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("An unexpected error occurred while fetching users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentUserId(null);
        setFormData({
            first_name: "",
            last_name: "",
            email: ""
        });
        setShowModal(true);
    };

    const openEditModal = (user: User) => {
        setIsEditing(true);
        setCurrentUserId(user.id);
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            const response = await deleteUser(userId);
            if (response.success) {
                setUsers(users.filter(user => user.id !== userId));
            } else {
                setError(response.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("An unexpected error occurred while deleting user");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing && currentUserId) {
            // Update existing user
            try {
                const response = await updateUser(currentUserId, formData);
                if (response.success) {
                    setUsers(users.map(user => 
                        user.id === currentUserId 
                            ? { ...user, ...formData } 
                            : user
                    ));
                    closeModal();
                } else {
                    setError(response.message || "Failed to update user");
                }
            } catch (error) {
                console.error("Error updating user:", error);
                setError("An unexpected error occurred while updating user");
            }
        } else {
            // In a real application, you would call an API to create a new user
            // For this demo, we'll just add it to the local state
            const newUser: User = {
                id: Math.max(...users.map(u => u.id), 0) + 1,
                ...formData,
                projects: 0,
                status: "active" // Setting a default status even though we're not displaying it
            };
            setUsers([...users, newUser]);
            closeModal();
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const matchesSearch = 
            fullName.includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-white bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">User Management</h1>
            
            {usingMockData && (
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-lg mb-6 shadow-lg flex justify-between items-center">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using mock data. Backend API not available.
                    </div>
                    <button 
                        onClick={fetchUsers}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100 transition shadow-md"
                    >
                        Retry API
                    </button>
                </div>
            )}
            
            {error && (
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg mb-6 shadow-lg">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={fetchUsers} 
                        className="mt-2 px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-100 transition shadow-md"
                    >
                        Retry
                    </button>
                </div>
            )}
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 border border-gray-700">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                    <div className="relative w-full md:w-auto md:min-w-[300px]">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="pl-10 pr-4 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent shadow-md w-full"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <button 
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition shadow-lg hover:shadow-purple-700/30 flex items-center justify-center"
                        onClick={openAddModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New User
                    </button>
                </div>
                
                <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                    <table className="min-w-full bg-gray-800/80 rounded-lg overflow-hidden">
                        <thead className="bg-gradient-to-r from-gray-700 to-gray-800">
                            <tr>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">ID</th>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">Name</th>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">Email</th>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">Projects</th>
                                <th className="py-3 px-4 text-left text-gray-300 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-8 px-4 text-center text-white">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 px-4 text-center text-gray-400">No users found</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr key={user.id} className={`${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'} hover:bg-gray-700/50 transition-colors duration-150`}>
                                        <td className="py-3 px-4 text-gray-300">{user.id}</td>
                                        <td className="py-3 px-4 text-white font-medium">{user.first_name} {user.last_name}</td>
                                        <td className="py-3 px-4 text-gray-300">{user.email}</td>
                                        <td className="py-3 px-4 text-gray-300">
                                            <div className="flex items-center">
                                                <span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full text-xs">
                                                    {user.projects}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 flex gap-2">
                                            <button 
                                                className="px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-md hover:from-blue-600 hover:to-blue-700 shadow-sm"
                                                onClick={() => openEditModal(user)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-md hover:from-red-600 hover:to-red-700 shadow-sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-5 flex flex-col md:flex-row md:justify-between md:items-center text-sm gap-3">
                    <span className="text-gray-400">Showing <span className="text-purple-400 font-medium">{filteredUsers.length}</span> of <span className="text-white">{users.length}</span> users</span>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-700/70 text-white rounded-lg hover:bg-gray-600/70 transition border border-gray-600/30 shadow-sm">Previous</button>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition shadow-sm">Next</button>
                    </div>
                </div>
            </div>

            {/* User Form Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-700 animate-fadeIn">
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-2xl font-bold text-white">
                                {isEditing ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button 
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2 text-sm">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2 text-sm">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                                    required
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2 text-sm">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700/70 border border-gray-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                                    required
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition shadow-sm"
                                >
                                    {isEditing ? 'Update' : 'Add'} User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement; 