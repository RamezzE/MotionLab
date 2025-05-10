import { FC, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import Logo from "/images/logo.png";
import useUserStore from "@/store/useUserStore";
import useProjectStore from "@/store/useProjectStore";
import useAvatarStore from "@/store/useAvatarStore";
import FormButton from "@/components/UI/FormButton"; // Import the FormButton component

// Reusable NavButtons component for common navigation links
const NavButtons: FC<{ onClick: () => void, navigate: any }> = ({ onClick, navigate }) => (
    <>
        <FormButton theme="transparent" onClick={() => { navigate("/about"); onClick(); }} label="About" fullWidth={false} textSize="base" />
        <FormButton theme="transparent" onClick={() => { navigate("/features"); onClick(); }} label="Features" fullWidth={false} textSize="base" />
        <FormButton theme="transparent" onClick={() => { navigate("/contact"); onClick(); }} label="Contact" fullWidth={false} textSize="base" />
        <FormButton theme="transparent" onClick={() => { navigate("/upload"); onClick(); }} label="Upload" fullWidth={false} textSize="base" />
    </>
);

// Reusable AuthButtons component for login/signup
const AuthButtons: FC<{ isAuthenticated: boolean; navigate: any, onClick: () => void }> = ({ isAuthenticated, navigate, onClick }) => {
    if (!isAuthenticated) {
        return (
            <>
                <FormButton
                    theme="transparent"
                    onClick={() => {
                        navigate("/auth/login");
                        onClick();
                    }}
                    label="Log In"
                    fullWidth={false}
                    textSize="base"
                />
                <FormButton
                    theme="default"
                    onClick={() => {
                        navigate("/auth/signup");
                        onClick();
                    }}
                    label="Join Now"
                    fullWidth={false}
                    textSize="base"
                />
            </>
        );
    }

    return null; // Will be handled in ProfileDropdown if authenticated
};

// Reusable ProfileDropdown component
const ProfileDropdown: FC<{ user: any; isAdmin: boolean; logoutFunc: any; setProfileDropdownOpen: any; profileDropdownOpen: boolean }> = ({ user, isAdmin, logoutFunc, setProfileDropdownOpen, profileDropdownOpen }) => (
    <div className="relative">
        <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center space-x-1 hover:text-purple-400 transition duration-300">
            <div className="flex justify-center items-center bg-gradient-to-r from-purple-500 to-purple-700 rounded-full w-8 h-8">
                <span className="font-semibold text-white text-sm">{user ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}` : ''}</span>
            </div>
            <ChevronDown size={16} />
        </button>

        {profileDropdownOpen && (
            <div className="right-0 z-20 absolute bg-gray-800 shadow-lg mt-2 border border-gray-700 rounded-md w-48">
                <div className="px-4 py-4 border-gray-700 border-b">
                    <p className="font-medium text-white text-sm">{user?.email}</p>
                    <p className="font-medium text-purple-400 text-xs">{isAdmin ? 'Administrator' : 'User'}</p>
                </div>
                <Link to="/profile/projects" className="block hover:bg-gray-700 px-4 py-2 text-gray-300 hover:text-white text-sm" onClick={() => setProfileDropdownOpen(false)}>
                    Your Projects
                </Link>
                <Link to="/profile/avatars" className="block hover:bg-gray-700 px-4 py-2 text-gray-300 hover:text-white text-sm" onClick={() => setProfileDropdownOpen(false)}>
                    Your Avatars
                </Link>
                {isAdmin && (
                    <Link to="/admin/dashboard" className="block hover:bg-gray-700 px-4 py-2 text-gray-300 hover:text-white text-sm" onClick={() => setProfileDropdownOpen(false)}>
                        Admin Dashboard
                    </Link>
                )}
                <button
                    className="block hover:bg-gray-700 px-4 py-2 w-full text-gray-300 hover:text-red-500 text-sm text-left cursor-pointer"
                    onClick={() => {
                        logoutFunc();
                        setProfileDropdownOpen(false); // Close dropdown on log out
                    }}>
                    Log Out
                </button>
            </div>
        )}
    </div>
);

const NavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
    const { user, isAuthenticated, logout } = useUserStore();
    const { clearProjects } = useProjectStore();
    const { clearAvatars } = useAvatarStore();

    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isAdmin = user?.is_admin || false;

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

    const logoutFunc = () => {
        logout();
        clearProjects();
        clearAvatars();
        setIsOpen(false);
        navigate("/");
    };

    return (
        <nav className="flex justify-between items-center bg-gray-700 bg-opacity-50 shadow-lg mx-auto mt-4 px-6 sm:px-7 py-3 rounded-3xl w-[90%] md:max-w-4xl text-white">
            <div className="flex flex-col items-center space-y-1">
                <Link to="/">
                    <img src={Logo} alt="Logo" className="w-7 md:w-10 h-7 md:h-10" />
                </Link>
                <span className="font-bold text-slate-300 text-xs">
                    <Link to="/">MotionLab</Link>
                </span>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden focus:outline-none text-white"
            >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4 md:space-x-12 font-medium text-sm md:text-base">
                <NavButtons onClick={() => setIsOpen(false)} navigate={navigate} />
            </div>

            {/* Desktop Auth Buttons & Profile Icon */}
            <div className="hidden md:flex items-center space-x-6 font-medium text-sm md:text-base">
                {!isAuthenticated ? (
                    <AuthButtons isAuthenticated={isAuthenticated} navigate={navigate}
                        onClick={() => {
                            setProfileDropdownOpen(false);
                            setIsOpen(false);
                        }}
                    />
                ) : (
                    <ProfileDropdown
                        user={user}
                        isAdmin={isAdmin}
                        logoutFunc={logoutFunc}
                        setProfileDropdownOpen={setProfileDropdownOpen}
                        profileDropdownOpen={profileDropdownOpen}
                    />
                )}
            </div>

            {/* Mobile Menu (Dropdown) */}
            {isOpen && (
                <div className="md:hidden top-20 left-0 z-50 absolute flex flex-col items-center space-y-4 bg-gray-800 bg-opacity-95 py-6 w-full">
                    <NavButtons onClick={() => setIsOpen(false)} navigate={navigate} />
                    {isAuthenticated && (
                        <>
                            <FormButton theme="transparent" onClick={() => { navigate("/profile/projects"); setIsOpen(false); }} label="Your Projects" fullWidth={false} textSize="base" />
                            <FormButton theme="transparent" onClick={() => { navigate("/profile/avatars"); setIsOpen(false); }} label="Your Avatars" fullWidth={false} textSize="base" />
                        </>
                    )}
                    <AuthButtons isAuthenticated={isAuthenticated} navigate={navigate}
                        onClick={() => {
                            setProfileDropdownOpen(false);
                            setIsOpen(false);
                        }}
                    />
                    {isAuthenticated && (
                        <FormButton
                            onClick={logoutFunc}
                            label="Log Out"
                            theme="default"
                            fullWidth={false}
                            textSize="base"
                        />
                    )}
                </div>
            )}
        </nav>
    );
};

export default NavBar;
