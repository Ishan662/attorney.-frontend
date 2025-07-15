import React, { useState } from 'react';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import AuthHeader from '../../components/layout/AuthHeader';

const UserOTP = () => {
    const [emailOTP, setEmailOTP] = useState(['', '', '', '']);
    const [phoneOTP, setPhoneOTP] = useState(['', '', '', '']);
    // Refs for OTP inputs
    const emailRefs = Array.from({ length: 4 }, () => React.createRef());
    const phoneRefs = Array.from({ length: 4 }, () => React.createRef());

    // Handle OTP input change
    const handleOTPChange = (type, idx, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const otpArr = type === 'email' ? [...emailOTP] : [...phoneOTP];
        otpArr[idx] = value;
        if (type === 'email') setEmailOTP(otpArr);
        else setPhoneOTP(otpArr);
        // Move to next field if value entered
        if (value && idx < 3) {
            // Focus next input
            if (type === 'email') {
                emailRefs[idx + 1].current && emailRefs[idx + 1].current.focus();
            } else {
                phoneRefs[idx + 1].current && phoneRefs[idx + 1].current.focus();
            }
        }
    };

    // Focus management for OTP fields
    const getInputProps = (type, idx) => ({
        value: type === 'email' ? emailOTP[idx] : phoneOTP[idx],
        onChange: e => handleOTPChange(type, idx, e.target.value),
        maxLength: 1,
        className: `w-10 h-10 text-lg text-center rounded-md border border-gray-300 focus:border-black focus:outline-none bg-gray-100 mx-1`,
        inputMode: 'numeric',
        key: `${type}-otp-${idx}`,
        ref: type === 'email' ? emailRefs[idx] : phoneRefs[idx],
    });

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 px-4 pt-20">
            <AuthHeader />
            <div className="flex-1 flex flex-col items-center justify-center ">
                <div className="w-full max-w-4xl mx-auto flex flex-col items-center rounded-xl shadow-md py-16 px-8 bg-white">
                    <h2 className="text-3xl font-bold mb-6 text-center">Enter the 4-digit code sent via SMS and Email</h2>
                    <p className="mb-8 text-center text-lg text-black">
                        SMS sent to <span className="font-bold">*******72</span> & Email sent to <span className="font-bold">j***@gmail.com</span>
                    </p>
                    <div className="mb-6 text-blue-400 text-center">
                        <a href="#" className="underline text-sm">Changed your mobile number?</a>
                    </div>

                    {/* Phone OTP */}
                    <div className="mb-8 flex flex-col items-center">
                        <label className="mb-2 font-semibold text-black text-base">Phone OTP</label>
                        <div className="flex justify-center mb-2">
                            {[0, 1, 2, 3].map(idx => (
                                <input {...getInputProps('phone', idx)} />
                            ))}
                        </div>
                        <Button1 text={<span>Resend code by SMS &rarr;</span>} inverted={false} className="mt-1 text-xs py-1 px-3" onClick={() => alert('Resend SMS OTP')} />
                    </div>

                    {/* Email OTP */}
                    <div className="mb-8 flex flex-col items-center">
                        <label className="mb-2 font-semibold text-black text-base">Email OTP</label>
                        <div className="flex justify-center mb-2">
                            {[0, 1, 2, 3].map(idx => (
                                <input {...getInputProps('email', idx)} />
                            ))}
                        </div>
                        <Button1 text={<span>Resend code by Email &rarr;</span>} inverted={false} className="mt-1 text-xs py-1 px-3 " onClick={() => alert('Resend Email OTP')} />
                    </div>

                    <div className="flex justify-between w-full mt-10">
                        <Button1 text={<span>&larr;</span>} className="w-8 h-8 flex items-center justify-center text-xs" onClick={() => alert('Back')} />
                        <Button1 text={<span>Next &rarr;</span>} className="w-20 h-8 flex items-center justify-center text-xs" onClick={() => alert('Next')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOTP;
