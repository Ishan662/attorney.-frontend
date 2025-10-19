import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classicalStatue from '../../assets/images/angell.png';
import classicalStatue2 from '../../assets/images/lion.png';
import { createSubscriptionSession } from '../../services/subscriptionService';

const Pricings = () => {
    const navigate = useNavigate();
    const [billingPeriod, setBillingPeriod] = useState('monthly');
    const [scrollY, setScrollY] = useState(0);
    const [loadingPlanId, setLoadingPlanId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            const mainContainer = document.querySelector('main');
            if (mainContainer) {
                setScrollY(mainContainer.scrollTop);
            }
        };

        const mainContainer = document.querySelector('main');
        if (mainContainer) {
            mainContainer.addEventListener('scroll', handleScroll);
            return () => mainContainer.removeEventListener('scroll', handleScroll);
        }
    }, []);

    const plans = [
        {
            id: null, // No ID for the free trial
            name: '7 days Free Trail',
            price: 0,
            description: 'Everything in FREE plan',
            features: [
                'Unlimited AI usage here',
                'Premium support',
                'Customer care on point',
                'Collaboration tools'
            ],
            buttonText: 'Get Started',
            buttonStyle: 'bg-blue-100 text-gray-800 hover:bg-blue-200'
        },
        {
            id: 2, // Backend ID for Pro Plan
            name: 'Pro',
            price: billingPeriod === 'monthly' ? 5 : 4,
            description: 'Everything in Pro plan',
            features: [
                'Integrations with 3rd-party',
                'Advanced analytics',
                'Team performance tracking',
                'Top grade security',
                'Customizable Solutions'
            ],
            buttonText: 'Subscribe Now',
            buttonStyle: 'bg-gray-900 text-white hover:bg-gray-800',
            popular: true
        },
        {
            id: 3, // Backend ID for Educator Plan
            name: 'Educator',
            price: billingPeriod === 'monthly' ? 2 : 1.6,
            description: 'Dedicated for Law students/researchers',
            features: [
                'Custom reports & dashboards',
                'Most performance usage',
                'Enterprise-grade security',
                'Customizable Solutions',
                'Seamless Integration',
                'Dedicated account manager'
            ],
            buttonText: 'Subscribe Now',
            buttonStyle: 'bg-blue-100 text-gray-800 hover:bg-blue-200'
        }
    ];

    const handleSubscribeClick = async (plan) => {
        if (plan.id === null) {
            navigate('/login');
            return;
        }

        setLoadingPlanId(plan.id);
        setError('');

        try {
            const response = await createSubscriptionSession(plan.id);
            if (response.checkoutUrl) {
                window.location.href = response.checkoutUrl;
            } else {
                throw new Error('Checkout URL not found in response.');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
            setLoadingPlanId(null);
        }
    };

    return (
        <div className="bg-gray-50 py-16 px-4 relative bg-gradient-to-br from-white via-gray-200 to-gray-400">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-2 h-2 bg-[#ff8800] rounded-full mr-2"></div>
                        <span className="text-gray-600 text-sm">Transparent Pricing, No Surprises</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
                        Flexible Plans for All
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choose a plan that fits your team and scale as you grow
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
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
                            <span className="absolute -top-3 -right-6 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>
                
                {error && (
                    <div className="text-center mb-8 bg-red-100 text-red-700 p-3 rounded-lg max-w-md mx-auto">
                        <p>{error}</p>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12 relative group">
                    <div
                        className="absolute -top-96 -right-44 z-10 w-[450px] h-[450px] md:w-[450px] md:h-[450px] pointer-events-none select-none"
                        style={{ transform: `translateY(${scrollY * 0.1}px)`, transition: 'transform 0.1s ease-out' }}
                    >
                        <img src={classicalStatue} alt="Decoration" className="w-full h-full object-contain filter brightness-100 contrast-110 drop-shadow-3xl transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div
                        className="absolute -left-32 bottom-6 pb-12 z-10 w-[300px] h-[300px] md:w-[300px] md:h-[300px] pointer-events-none select-none mt-8"
                        style={{ transform: `translateY(${scrollY * 0.1}px)`, transition: 'transform 0.1s ease-out' }}
                    >
                        <img src={classicalStatue2} alt="Decoration" className="w-full h-full object-contain filter -brightness-100 -contrast-110 drop-shadow-3xl transition-transform duration-500 group-hover:scale-110" />
                    </div>

                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl shadow-lg p-8 relative ${plan.popular ? 'border-2 border-gray-900' : 'border border-gray-200'}`}
                        >
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline mb-2">
                                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                    <span className="text-gray-600 ml-2">user/month</span>
                                </div>
                            </div>

                            <button
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 mb-6 ${plan.buttonStyle}`}
                                onClick={() => handleSubscribeClick(plan)}
                                disabled={loadingPlanId === plan.id}
                            >
                                {loadingPlanId === plan.id ? 'Processing...' : plan.buttonText}
                            </button>

                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 mb-4">{plan.description}</h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <div className="flex items-center justify-center text-gray-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Your Queries, Simplified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricings;