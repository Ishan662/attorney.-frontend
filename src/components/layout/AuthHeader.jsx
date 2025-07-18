import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/black_logo.png';

const AuthHeader = () => {
    return (
        <header className="w-full py-4 border-b border-gray-200 fixed top-0 left-0 right-0 bg-gray-50 z-10">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="logo">
                    <Link to="/" className="block">
                        <img
                            src={logo}
                            alt="Attorney logo"
                            className="h-8 hover:opacity-80 transition-opacity"
                            title="Go to home page"
                        />
                    </Link>
                </div>
                {/* Right side spacer to match main header's layout */}
                <div className="invisible">
                    {/* This is just a spacer */}
                </div>
            </div>
        </header>
    );
};

export default AuthHeader;