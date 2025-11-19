import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { ArrowLeft, RefreshCw, CheckCircle, Clock, Shield } from 'lucide-react';
import OTPInput from '../../Components/OTPInput';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';

export default function VerifyPhone({ phone, userType = 'customer', action = 'register' }) {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isResending, setIsResending] = useState(false);
    const [verificationError, setVerificationError] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const { t } = useTranslation();

    const { data, setData, post, processing, errors } = useForm({
        phone: phone,
        code: '',
        user_type: userType,
        action: action
    });

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleOTPComplete = (otp) => {
        setData('code', otp);
        setVerificationError(null);
        
        // Auto-submit when OTP is complete
        post('/verify-phone', {
            onSuccess: (page) => {
                setIsVerified(true);
                // Redirect to home page for all users
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            },
            onError: (errors) => {
                setVerificationError(errors.code || t('verify_invalid_code'));
            }
        });
    };

    const handleOTPChange = (otp) => {
        setData('code', otp);
    };

    const handleResendCode = async () => {
        setIsResending(true);
        setVerificationError(null);
        
        try {
            await fetch('/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ phone: phone, action: action })
            });
            
            setTimeLeft(300); // Reset timer
        } catch (error) {
            setVerificationError(t('verify_resend_failed'));
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const roleCopy = {
        admin: {
            title: t('verify_role_admin_title'),
            description: t('verify_role_admin_desc'),
        },
        store_owner: {
            title: t('verify_role_store_title'),
            description: t('verify_role_store_desc'),
        },
        driver: {
            title: t('verify_role_driver_title'),
            description: t('verify_role_driver_desc'),
        },
        customer: {
            title: t('verify_role_customer_title'),
            description: t('verify_role_customer_desc'),
        },
    };

    const userTypeInfo = roleCopy[userType] || roleCopy.customer;
    const backPath = action === 'login' ? '/login' : '/register';
    const backLabel = action === 'login' ? t('verify_back_to_login') : t('verify_back_to_register');

    const renderVerifiedView = () => (
        <Layout>
            <div className="relative min-h-screen bg-slate-950 py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <Head title={t('verify_success_title')} />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 opacity-90" />
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/40 blur-[200px]" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-400/30 blur-[200px]" />

                <div className="relative z-10 max-w-xl mx-auto">
                    <div className="text-center bg-white/10 backdrop-blur rounded-3xl p-10 border border-white/20 shadow-2xl text-white space-y-4">
                        <div className="mx-auto h-20 w-20 rounded-2xl bg-white/15 flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold">{t('verify_success_title')}</h2>
                        <p className="text-emerald-100">{t('verify_success_message')}</p>
                        <p className="text-sm text-emerald-200">{t('verify_success_redirect')}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );

    if (isVerified) {
        return renderVerifiedView();
    }

    return (
        <Layout>
            <div className="relative min-h-screen bg-slate-950 py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <Head title={t('verify_page_title')} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a0e4d] via-[#160b31] to-[#05030f]" />
                <div className="absolute -top-32 -right-40 w-96 h-96 bg-purple-500/40 blur-[200px]" />
                <div className="absolute -bottom-24 -left-32 w-96 h-96 bg-indigo-500/30 blur-[200px]" />

                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
                        <button
                            onClick={() => router.visit(backPath)}
                            className="inline-flex items-center gap-2 text-sm text-purple-100 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {backLabel}
                        </button>
                        {timeLeft > 0 && (
                            <div className="flex items-center gap-2 text-sm text-purple-200">
                                <Clock className="w-4 h-4" />
                                <span>{t('verify_code_expires_in', { time: formatTime(timeLeft) })}</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-10 space-y-8">
                        <div className="text-center space-y-3">
                            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-lg">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{t('verify_page_title')}</h2>
                                <p className="text-slate-500">{t('verify_page_subtitle')}</p>
                            </div>
                            <div className="text-sm font-semibold text-slate-700">
                                {t('verify_code_sent_to')} <span className="text-purple-600">{phone}</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                            <OTPInput
                                length={5}
                                onComplete={handleOTPComplete}
                                onChange={handleOTPChange}
                                onResend={handleResendCode}
                                phoneNumber={phone}
                                error={verificationError}
                                disabled={processing}
                            />

                            <div className="mt-6 flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const otpValue = data.code;
                                        if (otpValue && otpValue.length === 5) {
                                            handleOTPComplete(otpValue);
                                        }
                                    }}
                                    disabled={processing || !data.code || data.code.length !== 5}
                                    className="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? t('verify_verifying') : t('verify_manual_submit')}
                                </button>
                                <p className="text-center text-xs text-slate-500">
                                    {t('verify_current_code', {
                                        code: data.code || t('verify_current_code_empty'),
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {timeLeft === 0 && (
                                <button
                                    onClick={handleResendCode}
                                    disabled={isResending}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-semibold text-purple-700 hover:bg-purple-50 transition-colors disabled:opacity-50"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                                    {isResending ? t('verify_resending') : t('verify_resend')}
                                </button>
                            )}

                            <div className="flex-1 rounded-2xl border border-purple-100 bg-purple-50 p-4 text-sm text-slate-700 flex items-start gap-3">
                                <div className="p-2 rounded-full bg-purple-100">
                                    <Shield className="w-4 h-4 text-purple-700" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{userTypeInfo.title}</p>
                                    <p className="text-slate-500">{userTypeInfo.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-sm text-slate-500">
                            {t('verify_help_text')}{' '}
                            <button className="text-purple-600 font-semibold hover:text-purple-700 underline">
                                {t('verify_contact_support')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
