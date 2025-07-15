import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import Sidebar from '../../components/layout/Sidebar';
import statueImage from '../../assets/images/hero.png';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      title: "DEFEND",
      subtitle: "A / GENCY",
      description: "We live for design-driven creative works,\ncrafting and visualising an identity in the\ndigitalsphere.",
      buttonText: "GO AGENCY",
      image: statueImage,
      quote: "Attorney. Striking with Precision, Balancing with Integrity"
    },
    {
      id: 2,
      title: "JUSTICE",
      subtitle: "LEGAL / EXCELLENCE",
      description: "Empowering legal professionals with\nintelligent case management solutions\nfor the modern era.",
      buttonText: "EXPLORE SOLUTIONS",
      image: statueImage,
      quote: "Where Legal Innovation Meets Professional Excellence"
    },
    {
      id: 3,
      title: "PROTECT",
      subtitle: "CASE / MANAGEMENT",
      description: "Streamline your legal practice with\nadvanced technology and comprehensive\ncase tracking systems.",
      buttonText: "START TODAY",
      image: statueImage,
      quote: "Transforming Legal Practice Through Technology"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-gray-800 relative overflow-hidden">
          {/* Hero Section Carousel */}
          <div className="min-h-screen flex items-center justify-center relative -mt-14 overflow-hidden">

            {/* Slides Container */}
            <div className="w-full h-full relative">
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${index === currentSlide ? 'transform translate-x-0' :
                      index < currentSlide ? 'transform -translate-x-full' :
                        'transform translate-x-full'
                    }`}
                >
                  {/* Background Text */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <h1 className="text-[15rem] md:text-[20rem] lg:text-[25rem] font-black text-white opacity-10 leading-none tracking-tighter select-none animate-text-glow">
                      {slide.title}
                    </h1>
                  </div>

                  {/* Statue Image */}
                  <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2 z-10 animate-slide-in-right">
                    <div className="w-96 h-auto">
                      <img
                        src={slide.image}
                        alt="Classical Justice Statue"
                        className="w-full h-full object-contain filter brightness-110 contrast-110 drop-shadow-2xl"
                      />
                    </div>
                  </div>

                  {/* Left Content */}
                  <div className="absolute left-24 top-1/2 transform -translate-y-1/2 z-20 max-w-lg animate-slide-in-left">
                    <div className="mb-8">
                      <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide">
                        {slide.subtitle}
                      </h2>
                      <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 whitespace-pre-line">
                        {slide.description}
                      </p>
                      <div className="inline-block border border-gray-400 px-8 py-3 text-gray-300 hover:bg-white hover:text-black transition-all duration-300 cursor-pointer">
                        {slide.buttonText}
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
                      "{slide.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-30">
              <button
                onClick={prevSlide}
                className="w-12 h-12 border border-gray-400 flex items-center justify-center text-gray-400 hover:bg-gray-400 hover:text-black transition-all duration-300"
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 border border-gray-400 flex items-center justify-center text-gray-400 hover:bg-gray-400 hover:text-black transition-all duration-300"
              >
                →
              </button>
            </div>

            {/* Right Side Icons */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 z-30">
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl">
                📞
              </div>
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl">
                ✉️
              </div>
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl">
                💼
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-yellow-400' : 'bg-gray-600 hover:bg-gray-400'
                    }`}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;