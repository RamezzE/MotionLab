import React, { useState, useEffect } from "react";
import { getAllUsers, updateUser, deleteUser } from "@/api/adminAPIs";
import { User } from "@/api/adminAPIs";

interface UserFormData {
    first_name: string;
    last_name: string;
    email: string;
    status: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        first_name: "",
        last_name: "",
        email: "",
        status: "active"
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

    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            email: "",
            status: "active"
        });
        setShowModal(true);
    };

    const openEditModal = (user: User) => {
        setIsEditing(true);
        setCurrentUserId(user.id);
        setFormData({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            status: user.status
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

    const handleToggleStatus = async (userId: number, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        try {
            const response = await updateUser(userId, { status: newStatus });
            if (response.success) {
                setUsers(users.map(user => 
                    user.id === userId 
                        ? { ...user, status: newStatus } 
                        : user
                ));
            } else {
                setError(response.message || "Failed to update user status");
            }
        } catch (error) {
            console.error("Error updating user status:", error);
            setError("An unexpected error occurred while updating user status");
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
                projects: 0
            };
            setUsers([...users, newUser]);
            closeModal();
        }
    };

    // Filter users based on search term and status filter
    const filteredUsers = users.filter(user => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const matchesSearch = 
            fullName.includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">User Management</h1>
            
            {usingMockData && (
                <div className="bg-amber-600 text-white p-3 rounded-lg mb-4 flex justify-between items-center">
                    <div>
                        <span className="font-bold">Development Mode</span> - Using mock data. Backend API not available.
                    </div>
                    <button 
                        onClick={fetchUsers}
                        className="px-3 py-1 bg-white text-amber-600 rounded hover:bg-gray-100"
                    >
                        Retry API
                    </button>
                </div>
            )}
            
            {error && (
                <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={fetchUsers} 
                        className="mt-2 px-4 py-2 bg-white text-red-600 rounded-md hover:bg-gray-100 transition"
                    >
                        Retry
                    </button>
                </div>
            )}
            
            <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <select 
                            className="px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={statusFilter}
                            onChange={handleStatusFilter}
                        >
                            <option value="all">All Users</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <button 
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                        onClick={openAddModal}
                    >
                        Add New User
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-600">
                            <tr>
                                <th className="py-3 px-4 text-left text-white">ID</th>
                                <th className="py-3 px-4 text-left text-white">Name</th>
                                <th className="py-3 px-4 text-left text-white">Email</th>
                                <th className="py-3 px-4 text-left text-white">Status</th>
                                <th className="py-3 px-4 text-left text-white">Projects</th>
                                <th className="py-3 px-4 text-left text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-4 px-4 text-center text-white">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-4 px-4 text-center text-white">No users found</td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="py-3 px-4 text-white">{user.id}</td>
                                        <td className="py-3 px-4 text-white">{user.first_name} {user.last_name}</td>
                                        <td className="py-3 px-4 text-white">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-white text-xs rounded-full ${
                                                user.status === "active" ? "bg-green-500" : "bg-gray-500"
                                            }`}>
                                                {user.status === "active" ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-white">{user.projects}</td>
                                        <td className="py-3 px-4 flex gap-2">
                                            <button 
                                                className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                                onClick={() => openEditModal(user)}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                                                onClick={() => handleToggleStatus(user.id, user.status)}
                                            >
                                                {user.status === "active" ? "Disable" : "Enable"}
                                            </button>
                                            <button 
                                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
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
                
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-300">Showing {filteredUsers.length} of {users.length} users</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-gray-600 text-white rounded">Previous</button>
                        <button className="px-3 py-1 bg-gray-600 text-white rounded">Next</button>
                    </div>
                </div>
            </div>

            {/* User Form Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-4 text-white">
                            {isEditing ? 'Edit User' : 'Add New User'}
                        </h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-gray-300 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
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