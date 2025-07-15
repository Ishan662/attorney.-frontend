import React, { useState } from 'react';

const Pricings = () => {
    const [billingPeriod, setBillingPeriod] = useState('monthly');

    const plans = [
        {
            name: 'Basic',
            price: billingPeriod === 'monthly' ? 49 : 39,
            description: 'Perfect for individual lawyers',
            features: [
                'Up to 50 cases per month',
                'Basic case management',
                'Email support',
                'Standard document templates',
                'Basic reporting'
            ],
            buttonText: 'Get Started',
            buttonStyle: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        },
        {
            name: 'Professional',
            price: billingPeriod === 'monthly' ? 89 : 71,
            description: 'Most popular for small law firms',
            features: [
                'Everything in Basic plan',
                'Unlimited cases',
                'Advanced case management',
                'Priority email support',
                'Custom document templates',
                'Advanced analytics',
                'Client portal access'
            ],
            buttonText: 'Get Started',
            buttonStyle: 'bg-gray-900 text-white hover:bg-gray-800',
            popular: true
        },
        {
            name: 'Enterprise',
            price: billingPeriod === 'monthly' ? 149 : 119,
            description: 'For large law firms and organizations',
            features: [
                'Everything in Professional plan',
                'Dedicated account manager',
                'Custom integrations',
                'Advanced security features',
                'White-label solutions',
                'Phone support',
                'Custom training sessions',
                'API access'
            ],
            buttonText: 'Get Started',
            buttonStyle: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }
    ];

    return (
        <div className="bg-gray-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        <span className="text-gray-600 text-sm">Transparent Pricing, No Surprises</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
                        Flexible Plans for All
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Choose a plan that fits your practice and scale as you grow
                    </p>
                </div>

                {/* Billing Toggle */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white rounded-lg p-1 shadow-md">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-6 py-2 rounded-md transition-all duration-200 ${billingPeriod === 'monthly'
                                    ? 'bg-gray-200 text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-6 py-2 rounded-md transition-all duration-200 relative ${billingPeriod === 'yearly'
                                    ? 'bg-gray-200 text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Yearly
                            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                Save 20%
                            </span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-xl shadow-lg p-8 relative ${plan.popular ? 'border-2 border-gray-900' : 'border border-gray-200'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                                        Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-medium text-gray-900 mb-2">{plan.name}</h3>
                                <div className="flex items-baseline mb-2">
                                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                    <span className="text-gray-600 ml-2">/user/month</span>
                                </div>
                                <p className="text-gray-600">{plan.description}</p>
                            </div>

                            <button className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 mb-8 ${plan.buttonStyle}`}>
                                <span className="mr-2">👑</span>
                                {plan.buttonText}
                            </button>

                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 mb-4">
                                    {plan.name === 'Basic' ? 'Everything in starter plan' :
                                        plan.name === 'Professional' ? 'Everything in Basic plan' :
                                            'Everything in Professional plan'}
                                </h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                {/* Bottom Message */}
                <div className="text-center">
                    <div className="flex items-center justify-center text-gray-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>We donate 2% of your membership to legal aid organizations</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricings;
