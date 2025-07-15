import React from 'react';
import protectImage from '../../assets/images/serve.png';

const ProtectSlide = ({ isActive }) => {
    return (
        <>
            {/* Background Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1 className="text-[15rem] md:text-[20rem] lg:text-[22rem] font-black text-white opacity-10 leading-none tracking-tighter select-none animate-text-glow">
                    SERVE
                </h1>
            </div>

            {/* Hero Image */}
            <div className={`absolute right-1/2 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-1000 ${isActive ? 'animate-fade-in-up opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}>
                <div className="w-96 h-auto group cursor-pointer">
                    <img
                        src={protectImage}
                        alt="Legal Protection"
                        className="w-full h-full object-contain filter brightness-110 contrast-110 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                    />
                </div>
            </div>

            {/* Left Content */}
            <div className="absolute left-24 top-1/2 transform -translate-y-1/2 z-20 max-w-lg animate-slide-in-left">
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide">
                        CASE / MANAGEMENT
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                        Streamline your legal practice with<br />
                        advanced technology and comprehensive<br />
                        case tracking systems.
                    </p>
                    <div className="inline-block border border-gray-400 px-8 py-3 rounded-lg text-gray-300 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                        START TODAY
                    </div>
                </div>
            </div>

            {/* Bottom Quote Section */}
            <div className={`absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center transition-all duration-1000 delay-400 ${isActive ? 'animate-fade-in-up opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                <div className="border-t border-gray-600 pt-6 mb-4">
                    <h3 className="text-xl text-gray-300 tracking-wider">
                        OUR CLIENTS
                    </h3>
                </div>
                <p className="text-2xl md:text-3xl text-white font-light max-w-4xl mx-auto leading-relaxed">
                    "Transforming Legal Practice Through Technology"
                </p>
            </div>
        </>
    );
};

export default ProtectSlide;
