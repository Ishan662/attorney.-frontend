import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        workPhone: '',
        companySize: '',
        jobTitle: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission logic here
    };

    return (
        <div className="min-h-screen bg-white py-20 px-6 snap-start relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center bg-no-repeat opacity-10"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
                    }}
                ></div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-white/80"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side - Content */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-5xl font-bold text-gray-900 mb-6">
                                Let's chat about<br />
                                <span className="text-gray-800">Attorney Services</span>
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Have questions about Attorney Services? Fill out the form and we'll get back to you within 48 hours.
                            </p>
                        </div>

                        {/* Animated Graphics */}
                        <div className="relative flex justify-center items-center">
                            <div className="relative">
                                {/* Main central icon */}
                                <div className="w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center transform rotate-6 relative z-10">
                                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </div>

                                {/* Orbiting icons */}
                                <div className="absolute -top-8 -left-8 w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center transform -rotate-12 animate-pulse">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                    </svg>
                                </div>

                                <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center transform rotate-12 animate-bounce">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                </div>

                                {/* Connecting arrows */}
                                <div className="absolute top-4 left-16">
                                    <svg className="w-12 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>

                                <div className="absolute bottom-8 right-16">
                                    <svg className="w-12 h-8 text-gray-400 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="bg-blue-600 rounded-3xl p-8 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-green-400 opacity-20 rounded-tl-full"></div>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            {/* Name Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        First Name*
                                    </label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Last Name*
                                    </label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email and Company */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Email*
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Please enter your work email"
                                        className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none placeholder-gray-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Company*
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Work Phone */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Work Phone #*
                                </label>
                                <input
                                    type="tel"
                                    name="workPhone"
                                    value={formData.workPhone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Company Size */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Company Size*
                                </label>
                                <select
                                    name="companySize"
                                    value={formData.companySize}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-400"
                                    required
                                >
                                    <option value="">Select...</option>
                                    <option value="1-10">1-10 employees</option>
                                    <option value="11-50">11-50 employees</option>
                                    <option value="51-200">51-200 employees</option>
                                    <option value="201-500">201-500 employees</option>
                                    <option value="500+">500+ employees</option>
                                </select>
                            </div>

                            {/* Job Title */}
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Job Title*
                                </label>
                                <input
                                    type="text"
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-white rounded-lg border-0 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                    required
                                />
                            </div>

                            {/* Privacy Policy */}
                            <div className="text-sm text-white">
                                By submitting this form, I acknowledge receipt of{' '}
                                <a href="#" className="text-blue-200 hover:text-blue-100 underline">
                                    Attorney's Privacy Policy
                                </a>
                                .
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
