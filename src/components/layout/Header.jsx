import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/white_logo.png';

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-black via-gray-900 to-gray-800 text-white py-4 w-full">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <div className="logo">
                    <Link to="/" className="block">
                        <img
                            src={logo}
                            alt="attorney."
                            className="h-8 hover:opacity-90 transition-opacity" 
                        />
                    </Link>
                </div>

                <nav className="hidden md:block text-sm">
                    <ul className="flex space-x-8 font-bold">
                        <li><Link to="/" className="hover:opacity-80 transition-opacity">Home</Link></li>
                        <li><Link to="/overview" className="hover:opacity-80 transition-opacity">Overview</Link></li>
                        <li><Link to="/plans-pricing" className="hover:opacity-80 transition-opacity">Plans and Pricing</Link></li>
                    </ul>
                </nav>

                <div className="flex items-center space-x-6 text-sm font-bold">
                    <Link to="/help" className="hover:opacity-80 transition-opacity">Help</Link>
                    <div className="flex items-center space-x-3">
                        <Link to="user/login" className="hover:opacity-80 transition-opacity">Log in</Link>
                        <Link to="user/signup" className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 
                        transition-colors font-medium">Sign up</Link>
                    </div>
                </div>

                {/* Mobile menu button - to be expanded with functionality */}
                <button className="md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile menu - hidden by default */}
            <div className="hidden md:hidden px-4 py-2">
                <ul className="flex flex-col space-y-2 font-bold">
                    <li><Link to="/" className="block py-1">Home</Link></li>
                    <li><Link to="/overview" className="block py-1">Overview</Link></li>
                    <li><Link to="/plans-pricing" className="block py-1">Plans and Pricing</Link></li>
                </ul>
            </div>
        </header>
    );
};

export default Header;