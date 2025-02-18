import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react"; // Import icons
import Logo from "/images/logo.png";

import useUserStore from "../store/useUserStore";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useUserStore();

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
            <Link to="/profile/projects" className="hover:text-purple-400 transition duration-300">
              <User size={24} />
            </Link>
            <button
              onClick={logout}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white text-center transition duration-300"
            >
              Log Out
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden top-20 left-0 z-50 absolute flex flex-col items-center space-y-4 bg-gray-800 bg-opacity-95 py-6 w-full">
          <Link to="/about" className="text-white hover:text-purple-400 transition duration-300" onClick={() => setIsOpen(false)}>
            About
          </Link>
          <Link to="/features" className="text-white hover:text-purple-400 transition duration-300" onClick={() => setIsOpen(false)}>
            Features
          </Link>
          <Link to="/contact" className="text-white hover:text-purple-400 transition duration-300" onClick={() => setIsOpen(false)}>
            Contact
          </Link>
          <Link to="/upload" className="text-white hover:text-purple-400 transition duration-300" onClick={() => setIsOpen(false)}>
            Upload
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-white hover:text-purple-400 transition duration-300" onClick={() => setIsOpen(false)}>
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white text-center transition duration-300"
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
                <span>Profile</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md text-white text-center transition duration-300"
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
