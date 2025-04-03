import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer className="pb-6 text-gray-400">
            <div className="mx-auto px-4 text-center container">
                {/* Main Content */}
                <p className="mb-4 text-sm">
                    © 2025 MotionLab. All rights reserved.
                </p>

                {/* Links Section */}
                <div className="flex justify-center space-x-4 text-sm">
                    <Link to="/privacy-policy" className="hover:text-purple-500 transition">
                        Privacy Policy
                    </Link>
                    <span>|</span>
                    <Link to="/terms-of-service" className="hover:text-purple-500 transition">
                        Terms of Service
                    </Link>
                    <span>|</span>
                    <Link to="/contact" className="hover:text-purple-500 transition">
                        Contact Us
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
