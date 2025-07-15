import React, { useState } from 'react';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import Sidebar from '../../components/layout/Sidebar';
import DefendSlide from '../../components/slides/DefendSlide';
import JusticeSlide from '../../components/slides/JusticeSlide';
import ProtectSlide from '../../components/slides/ProtectSlide';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides components
  const heroSlides = [
    { id: 1, component: DefendSlide },
    { id: 2, component: JusticeSlide },
    { id: 3, component: ProtectSlide }
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
          <div className="h-screen flex items-center justify-center relative -mt-16">

            {/* Slides Container */}
            <div className="w-full h-full relative">
              {heroSlides.map((slide, index) => {
                const SlideComponent = slide.component;
                return (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 w-full h-full transition-transform duration-700 ease-in-out ${index === currentSlide ? 'transform translate-x-0' :
                      index < currentSlide ? 'transform -translate-x-full' :
                        'transform translate-x-full'
                      }`}
                  >
                    <SlideComponent />
                  </div>
                );
              })}
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