const Footer = () => {
    return (
      <footer className="text-gray-400 py-6">
        <div className="container mx-auto px-4 text-center">
          {/* Main Content */}
          <p className="text-sm mb-4">
            © 2023 MotionLab. All rights reserved.
          </p>
  
          {/* Links Section */}
          <div className="flex justify-center space-x-4 text-sm">
            <a
              href="#"
              className="hover:text-purple-500 transition"
            >
              Privacy Policy
            </a>
            <span>|</span>
            <a
              href="#"
              className="hover:text-purple-500 transition"
            >
              Terms of Service
            </a>
            <span>|</span>
            <a
              href="#"
              className="hover:text-purple-500 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  