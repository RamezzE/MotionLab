import { Link } from "react-router-dom";
import Logo from "/images/logo.png";

const NavBar = () => {
  return (
    <nav className="bg-gray-700 bg-opacity-50 text-white px-6 sm:px-7 py-4 flex items-center justify-between shadow-lg rounded-3xl mx-auto my-4 w-5/6 md:max-w-4xl">
      <div className="flex flex-col items-center space-y-1">
        <Link to="/">
          <img src={Logo} alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
        </Link>
        <span className="text-xs text-slate-300 font-bold">
          <Link to="/">MotionLab</Link>
        </span>
      </div>
      <div className="flex space-x-2 md:space-x-12 justify-center text-sm md:text-base font-medium">
        <Link
          to="/about"
          className="hover:text-purple-400 transition duration-300"
        >
          About
        </Link>
        <Link
          to="/features"
          className="hover:text-purple-400 transition duration-300"
        >
          Features
        </Link>
        <Link
          to="/contact"
          className="hover:text-purple-400 transition duration-300"
        >
          Contact
        </Link>
        <Link
          to="/upload"
          className="hover:text-purple-400 transition duration-300"
        >
          Upload
        </Link>
      </div>

      <div className="flex items-center space-x-2 md:space-x-6 text-sm md:text-base font-medium">
        <Link
          to="/login"
          className="hidden xs:block hover:text-purple-400 transition duration-300"
        >
          Log In
        </Link>
        <Link
          to="/signup"
          className="bg-purple-600 text-white text-center px-3 sm:px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300"
        >
          <span className="flex flex-row">
            Join<span className="hidden sm:block">&nbsp;Now</span>
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
