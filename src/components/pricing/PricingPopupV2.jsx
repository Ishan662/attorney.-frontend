import React, { useState, useEffect } from 'react';
import classicalStatue from '../../assets/images/angell.png';

const PricingPopup = ({ isOpen, onClose, showSkipButton = false }) => {
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const popupContainer = document.querySelector('.popup-container');
            if (popupContainer) {
                setScrollY(popupContainer.scrollTop);
            }
        };

        const popupContainer = document.querySelector('.popup-container');
        if (popupContainer) {
            popupContainer.addEventListener('scroll', handleScroll);
            return () => popupContainer.removeEventListener('scroll', handleScroll);
        }
    }, [isOpen]);

    // Close popup when clicking outside
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Close popup on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const plans = [
        {
            name: '7 days Free Trial',
            price: 0,
            description: 'Everything in FREE plan',
            features: [
                'Unlimited AI usage',
                'Premium support',
                'Customer care',
                'Collaboration tools'
            ],
            buttonText: 'Get Started',
            buttonStyle: 'bg-blue-100 text-gray-800 hover:bg-blue-200'
        },
        {
            name: 'Pro',
            price: billingPeriod === 'monthly' ? 1500 : 1200,
            description: 'Everything in Pro plan',
            features: [
                'Integrations with 3rd-party',
                'Advanced analytics',
                'Team performance tracking',
                'Top grade security',
                'Customizable Solutions'
            ],
            buttonText: 'Get Started',
            buttonStyle: 'bg-gray-900 text-white hover:bg-gray-800',
            popular: true
        }
    ];

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleOverlayClick}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] 
                          popup-container overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-lg 
                              hover:bg-gray-50 transition-colors duration-200"
                >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Popup Content */}
                <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 py-8 px-6 relative">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center mb-3">
                                <div className="w-2 h-2 bg-[#ff8800] rounded-full mr-2"></div>
                                <span className="text-gray-600 text-sm">Transparent Pricing, No Surprises</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                                Upgrade Your Plan
                            </h2>
                            <p className="text-gray-600 text-base max-w-xl mx-auto">
                                Choose a plan that fits your needs and unlock all premium features
                            </p>
                        </div>

                        {/* Billing Toggle */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-white rounded-lg p-1 shadow-md">
                                <button
                                    onClick={() => setBillingPeriod('monthly')}
                                    className={`px-6 py-2 rounded-md transition-all duration-200 ${billingPeriod === 'monthly'
                                        ? 'bg-blue-100 text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingPeriod('yearly')}
                                    className={`px-6 py-2 rounded-md transition-all duration-200 relative ${billingPeriod === 'yearly'
                                        ? 'bg-blue-100 text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Yearly
                                    <span className="absolute -top-3 -right-6 bg-blue-500 text-white 
                                                   text-xs px-2 py-1 rounded-full">
                                        Save 20%
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Pricing Cards */}
                        <div className="grid md:grid-cols-2 gap-4 mb-8 relative group max-w-2xl mx-auto">
                            {/* Decorative Image - Larger */}
                            <div
                                className="absolute -top-16 -right-20 z-10 w-[150px] h-[150px] 
                                          md:w-[200px] md:h-[200px] pointer-events-none select-none 
                                          transition-all duration-700 hover:scale-110 hidden md:block"
                                style={{
                                    transform: `translateY(${scrollY * 0.05}px)`,
                                    transition: 'transform 0.1s ease-out'
                                }}
                            >
                                <img
                                    src={classicalStatue}
                                    alt="Legal Decoration"
                                    className="w-full h-full object-contain filter brightness-100 
                                              contrast-110 drop-shadow-xl transition-transform 
                                              duration-500 group-hover:scale-110"
                                />
                            </div>

                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`bg-white rounded-lg shadow-md p-4 relative transform 
                                              hover:scale-102 transition-all duration-300 ${plan.popular
                                            ? 'border-2 border-gray-900 ring-1 ring-gray-100'
                                            : 'border border-gray-200'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gray-900 text-white px-3 py-1 
                                                           rounded-full text-xs font-medium shadow-md">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="mb-4">
                                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                                            {plan.name}
                                        </h3>
                                        <div className="flex items-baseline mb-2">
                                            <span className="text-2xl font-bold text-gray-900">
                                                LKR {plan.price}
                                            </span>
                                            <span className="text-gray-600 ml-1 text-sm">
                                                /user/month
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-xs">{plan.description}</p>
                                    </div>

                                    <button
                                        className={`w-full py-2 px-3 rounded-md font-medium text-sm
                                                   transition-all duration-200 mb-4 shadow-sm 
                                                   hover:shadow-md transform hover:-translate-y-0.5 
                                                   ${plan.buttonStyle}`}
                                        onClick={() => {
                                            // Handle plan selection here
                                            onClose();
                                        }}
                                    >
                                        {plan.buttonText}
                                    </button>

                                    <div className="space-y-2">
                                        <h4 className="font-medium text-gray-900 text-sm mb-3">
                                            What's included:
                                        </h4>
                                        <ul className="space-y-2">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex}
                                                    className="flex items-center text-gray-700 text-xs">
                                                    <svg
                                                        className="w-3 h-3 text-green-500 mr-2 flex-shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Section */}
                        <div className="text-center">
                            <div className="flex items-center justify-center text-gray-600 mb-4">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 
                                           11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 
                                           9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                    />
                                </svg>
                                <span className="font-medium text-sm">30-day money-back guarantee</span>
                            </div>

                            {/* Skip Button */}
                            {showSkipButton && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-500 hover:text-gray-700 underline font-medium 
                                             transition-colors duration-200 text-sm"
                                >
                                    Skip for now
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricingPopup;
