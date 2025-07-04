import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button1 from '../../components/UI/Button1';

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize animation
    const animateNumbers = () => {
      const numbers = document.querySelectorAll('.animate-number');
      numbers.forEach(number => {
        number.classList.add('animate-bounce');
        setTimeout(() => {
          number.classList.remove('animate-bounce');
        }, 1000);
      });
    };

    // Run animation initially and every few seconds
    animateNumbers();
    const interval = setInterval(animateNumbers, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-5">
      {/* Navigation bar with logo */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-12">
        <Link to="/" className="flex items-center">
          <div className="flex items-center space-x-2">
            <span className="text-4xl font-bold text-gray-800">attorney.</span>
          </div>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto">
        {/* Left side with animated numbers */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0 flex justify-center">
          <div className="relative">
            <div className="flex items-center justify-center">
              <span className="animate-number text-9xl font-bold text-blue-600 mr-2">4</span>
              <div className="relative animate-number">
                <span className="text-9xl font-bold text-blue-600">0</span>
                {/* Animated gavel */}
                <div className="absolute inset-0 flex items-center justify-center animation-gavel">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 14.8V20h2v-3.7l4 2.2V22h2v-3.5l-8-4.7z"></path>
                  </svg>
                </div>
              </div>
              <span className="animate-number text-9xl font-bold text-blue-600 ml-2">4</span>
            </div>
            <div className="mt-4 text-center">
              <div className="animate-pulse w-32 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right side with message */}
        <div className="w-full md:w-1/2 text-center md:text-left md:pl-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-6 max-w-md">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button1 
              text="Back to Home" 
              onClick={() => navigate('/')}
              className="px-6 py-3"
            />
            <Button1
              text="Go to Dashboard" 
              onClick={() => navigate('/client/dashboard')}
                          />
          </div>
        </div>
      </div>      

      {/* Footer */}
      <div className="mt-16 text-center text-gray-600">
        <p>
          Need assistance? <Link to="/contact" className="text-blue-600 hover:text-blue-800">Contact Support</Link>
        </p>
      </div>

      {/* Add the animation CSS */}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @keyframes gavel {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(20deg); }
        }

        @keyframes balance-left {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        @keyframes balance-right {
          0%, 100% { transform: translateY(8px); }
          50% { transform: translateY(0); }
        }

        .animate-bounce {
          animation: bounce 1s ease-in-out;
        }

        .animation-gavel {
          animation: gavel 2s infinite ease-in-out;
          transform-origin: bottom right;
        }

        .animate-balance-left {
          animation: balance-left 3s infinite ease-in-out;
        }

        .animate-balance-right {
          animation: balance-right 3s infinite ease-in-out;
        }

        .animation-scale {
          animation: float 6s infinite ease-in-out;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;