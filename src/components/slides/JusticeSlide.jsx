import React from 'react';
import justiceImage from '../../assets/images/lady.png';

const JusticeSlide = () => {
    return (
        <>
            {/* Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1 className="text-[15rem] md:text-[20rem] lg:text-[22rem] font-black text-white opacity-10 leading-none tracking-tighter select-none animate-text-glow">
                    JUSTICE
                </h1>
            </div>

            {/* Hero Image */}
            <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2 z-10 animate-slide-in-right">
                <div className="w-96 h-auto">
                    <img
                        src={justiceImage}
                        alt="Classical Justice Statue"
                        className="w-full h-full object-contain filter brightness-110 contrast-110 drop-shadow-2xl"
                    />
                </div>
            </div>

            {/* Left Content */}
            <div className="absolute left-24 top-1/2 transform -translate-y-1/2 z-20 max-w-lg animate-slide-in-left">
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide">
                        LEGAL / EXCELLENCE
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                        Empowering legal professionals with<br />
                        intelligent case management solutions<br />
                        for the modern era.
                    </p>
                    <div className="inline-block border border-gray-400 px-8 py-3 text-gray-300 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                        EXPLORE SOLUTIONS
                    </div>
                </div>
            </div>

            {/* Bottom Quote Section */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center animate-fade-in-up">
                <div className="border-t border-gray-600 pt-6 mb-4">
                    <h3 className="text-xl text-gray-300 tracking-wider">
                        OUR CLIENTS
                    </h3>
                </div>
                <p className="text-2xl md:text-3xl text-white font-light max-w-4xl mx-auto leading-relaxed">
                    "Where Legal Innovation Meets Professional Excellence"
                </p>
            </div>
        </>
    );
};

export default JusticeSlide;
