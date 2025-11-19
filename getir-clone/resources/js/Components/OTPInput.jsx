import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function OTPInput({ 
    length = 5, 
    onComplete, 
    onChange,
    onResend,
    phoneNumber,
    error = null,
    disabled = false,
    autoFocus = true
}) {
    const [otp, setOtp] = useState(Array(length).fill(''));
    const [activeIndex, setActiveIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    useEffect(() => {
        const otpString = otp.join('');
        onChange?.(otpString);
        if (otpString.length === length && !otpString.includes('')) {
            setIsComplete(true);
            onComplete?.(otpString);
        } else {
            setIsComplete(false);
        }
    }, [otp, length]);

    const handleChange = (index, value) => {
        if (disabled) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < length - 1) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (disabled) return;

        // Handle backspace
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                setActiveIndex(index - 1);
                inputRefs.current[index - 1]?.focus();
            }
        }
        
        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            setActiveIndex(index - 1);
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < length - 1) {
            setActiveIndex(index + 1);
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        if (disabled) return;
        
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
        const newOtp = [...otp];
        
        for (let i = 0; i < pastedData.length && i < length; i++) {
            newOtp[i] = pastedData[i];
        }
        
        setOtp(newOtp);
        
        // Focus on the next empty input or the last input
        const nextIndex = Math.min(pastedData.length, length - 1);
        setActiveIndex(nextIndex);
        inputRefs.current[nextIndex]?.focus();
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await onResend?.();
        } finally {
            setIsResending(false);
        }
    };

    const clearOtp = () => {
        setOtp(Array(length).fill(''));
        setActiveIndex(0);
        setIsComplete(false);
        inputRefs.current[0]?.focus();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                    {isComplete ? (
                        <CheckCircle className="w-8 h-8 text-green-400" />
                    ) : error ? (
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    ) : (
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}
                </div>
                <h2 className="text-2xl font-bold text-purple-600 mb-2">Enter Verification Code</h2>
                <p className="text-purple-600">
                    We sent a 5-digit code to
                </p>
                <p className="font-medium text-purple-600">{phoneNumber}</p>
            </div>

            {/* OTP Input */}
            <div className="space-y-4">
                <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={handlePaste}
                            onFocus={() => setActiveIndex(index)}
                            disabled={disabled}
                            className={`w-12 h-12 text-center text-xl font-bold border-2 border-purple-600 bg-white bg-opacity-10 rounded-lg focus:outline-none transition-all duration-200 text-purple-600${
                                error
                                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50 text-red-700'
                                    : isComplete
                                        ? 'border-green-400 bg-green-50 text-green-700'
                                        : activeIndex === index
                                            ? 'border-white focus:ring-2 focus:ring-white focus:ring-opacity-50 bg-white bg-opacity-20 text-purple-600'
                                            : 'border-white border-opacity-50 focus:border-white bg-white bg-opacity-10 text-purple-600 placeholder-white placeholder-opacity-50'
                            } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        />
                    ))}
                </div>

                {/* Error Message */}
                {error && (
                    <p className="text-center text-sm text-red-300 flex items-center justify-center text-purple-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {error}
                    </p>
                )}

                {/* Success Message */}
                {isComplete && !error && (
                    <p className="text-center text-sm text-green-300 flex items-center justify-center text-purple-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Code verified successfully!
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
                {/* Resend Code */}
                <div className="text-center">
                    <p className="text-sm mb-2 text-purple-600">
                        Didn't receive the code?
                    </p>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending || disabled}
                        className="inline-flex items-center text-sm font-medium  text-purple-600 hover:text-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-1 animate-spin text-purple-600" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4 mr-1 text-purple-600" />
                                Resend Code
                            </>
                        )}
                    </button>
                </div>

                {/* Clear Button */}
                {otp.some(digit => digit !== '') && (
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={clearOtp}
                            disabled={disabled}
                            className="text-sm text-purple-600 hover:text-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Clear and start over
                        </button>
                    </div>
                )}
            </div>

            {/* Timer (optional) */}
            <div className="text-center">
                <p className="text-xs text-purple-600">
                    Code expires in 5 minutes
                </p>
            </div>
        </div>
    );
}
