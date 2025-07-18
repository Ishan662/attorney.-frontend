import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import Sidebar from '../../components/layout/Sidebar';
import DefendSlide from '../../components/slides/DefendSlide';
import JusticeSlide from '../../components/slides/JusticeSlide';
import ProtectSlide from '../../components/slides/ProtectSlide';
import Pricings from '../../components/pricing/Pricings';
import Overview from '../../components/overview/Overview';
import FAQ from '../../components/overview/FAQ';
import Contact from '../../components/overview/Contact';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides components
  const heroSlides = [
    { id: 1, component: DefendSlide },
    { id: 2, component: JusticeSlide },
    { id: 3, component: ProtectSlide }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000); // Change slide every 6 seconds

    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="flex h-screen">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 relative snap-y snap-mandatory">
          {/* Hero Section Carousel */}
          <div id="home" className="h-screen flex items-center justify-center relative -mt-40 snap-start overflow-hidden">

            {/* Slides Container */}
            <div className="w-full h-full relative overflow-hidden">
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
                    <SlideComponent isActive={index === currentSlide} />
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
              {/* Phone Icon */}
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors cursor-pointer group">
                <div className="relative w-6 h-6 [perspective:1000px]">
                  <div className="absolute inset-0 w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front - Phone Icon */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    {/* Back - Balance Icon */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M8 8l-4 2v4l4-2M16 8l4 2v4l-4-2M8 8a2 2 0 11-4 0 2 2 0 014 0zM20 8a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Icon */}
              <div
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors cursor-pointer group"
                onClick={scrollToContact}
              >
                <div className="relative w-6 h-6 [perspective:1000px]">
                  <div className="absolute inset-0 w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front - Email Icon */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {/* Back - Balance Icon */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M8 8l-4 2v4l4-2M16 8l4 2v4l-4-2M8 8a2 2 0 11-4 0 2 2 0 014 0zM20 8a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Briefcase Icon */}
              <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors cursor-pointer group">
                <div className="relative w-6 h-6 [perspective:1000px]">
                  <div className="absolute inset-0 w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    {/* Front - Briefcase Icon */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    {/* Back - Balance Icon */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M8 8l-4 2v4l4-2M16 8l4 2v4l-4-2M8 8a2 2 0 11-4 0 2 2 0 014 0zM20 8a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
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

          {/* Overview Section */}
          <div id="overview" className="mt-24 min-h-screen snap-start bg-gray-50  relative z-10 overflow-hidden">
            <Overview />
          </div>

          {/* Pricing Section - Slides on top with snap */}
          <div id="plans-pricing" className="min-h-screen snap-start bg-gray-50  relative z-10 overflow-hidden">
            <Pricings />
          </div>


          {/* FAQ Section */}
          <div id="help" className="mt-24 min-h-screen snap-start bg-gray-50  relative z-10 overflow-hidden">
            <FAQ />
          </div>

          {/* Contact Section */}
          <div id="contact" className="snap-start relative z-10 overflow-hidden">
            <Contact />
          </div>



        </main>
      </div>
    </div>
  );
};

export default Home;