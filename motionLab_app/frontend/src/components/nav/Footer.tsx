import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="py-6 text-gray-400">
            <div className="mx-auto px-4 text-center container">
                {/* Main Content */}
                <p className="mb-4 text-sm">
                    © 2025 MotionLab. All rights reserved.
                </p>

                {/* Links Section */}
                <div className="flex justify-center space-x-4 text-sm">
                    <a href="#" className="hover:text-purple-500 transition">
                        Privacy Policy
                    </a>
                    <span>|</span>
                    <a href="#" className="hover:text-purple-500 transition">
                        Terms of Service
                    </a>
                    <span>|</span>
                    <a href="#" className="hover:text-purple-500 transition">
                        Contact Us
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
