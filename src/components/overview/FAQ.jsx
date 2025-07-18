import React, { useState } from 'react';

const FAQ = () => {
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const faqData = [
        {
            id: 1,
            question: "What is Attorney ?",
            answer: "Attorney is a comprehensive legal platform that connects clients with qualified lawyers, streamlines case management, and provides AI-powered legal assistance to make legal services more accessible and efficient."
        },
        {
            id: 2,
            question: "Do I need coding skills to use Attorney ?",
            answer: "No, Attorney is designed to be user-friendly for everyone. Whether you're a client seeking legal help or a lawyer managing cases, our intuitive interface requires no technical knowledge."
        },
        {
            id: 3,
            question: "Is Attorney optimized for SEO ?",
            answer: "Yes, Attorney is built with modern web standards and SEO best practices to ensure your legal practice has maximum online visibility and can be easily found by potential clients."
        },
        {
            id: 4,
            question: "Can I customize Attorney to fit my brand ?",
            answer: "Absolutely! Attorney offers extensive customization options allowing you to personalize the platform with your law firm's branding, colors, and professional identity."
        },
        {
            id: 5,
            question: "Does Attorney include mobile responsiveness ?",
            answer: "Yes, Attorney is fully responsive and optimized for all devices. Whether you're on desktop, tablet, or mobile, you'll have a seamless experience managing your legal matters."
        }
    ];

    const toggleQuestion = (questionId) => {
        setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 py-20 px-6 snap-start">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm font-medium">Your Queries, Simplified</span>
                    </div>

                    <h2 className="text-5xl font-bold text-white mb-6">
                        Questions? Answers!
                    </h2>

                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                        Find quick answers to the most common questions about our platform
                    </p>
                </div>

                {/* FAQ Questions */}
                <div className="space-y-4 mb-16">
                    {faqData.map((faq) => (
                        <div
                            key={faq.id}
                            className="bg-white/10 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden transition-all duration-300 hover:bg-white/15"
                        >
                            <button
                                onClick={() => toggleQuestion(faq.id)}
                                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
                            >
                                <span className="text-gray-200 text-lg font-medium pr-4">
                                    {faq.question}
                                </span>
                                <div className={`transition-transform duration-300 ${expandedQuestion === faq.id ? 'rotate-180' : ''}`}>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>

                            {expandedQuestion === faq.id && (
                                <div className="px-8 pb-6">
                                    <div className="border-t border-gray-600/30 pt-4">
                                        <p className="text-gray-300 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="text-center">
                    <div className="inline-flex items-center gap-3 bg-gray-800/30 backdrop-blur-sm px-6 py-4 rounded-2xl border border-gray-700/50">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full">
                            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-gray-300">Feel free to mail us for any enquiries :</span>
                        <a
                            href="mailto:attorney@support.com"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                        >
                            attorney@support.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
