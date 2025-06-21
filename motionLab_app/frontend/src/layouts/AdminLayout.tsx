import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/admin/header";
import SideBar from "../components/admin/sideBar";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Handle sidebar toggle
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Handle responsive sidebar behavior
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-800 text-white">
            <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <SideBar isOpen={isSidebarOpen} />
            
            {/* Overlay to close sidebar on mobile when clicked */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-0"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
            
            <main className={`pt-16 min-h-screen transition-all duration-300 ${
                isSidebarOpen ? 'md:ml-64' : 'ml-0'
            }`}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;