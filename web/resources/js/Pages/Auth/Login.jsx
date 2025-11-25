import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';

export default function Login() {
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const { t, locale } = useTranslation();

    const { data, setData, post, processing, errors } = useForm({
        phone: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    const handlePhoneChange = (value, country) => {
        setData('phone', value);
        // Basic validation - check if phone number is valid
        const isValid = value && value.length >= 10;
        setIsPhoneValid(isValid);
    };

    const badges = [
        t('login_badge_fast') || 'Fast Login',
        t('login_badge_secure') || 'Secure',
        t('login_badge_support') || '24/7 Support',
    ];

    return (
        <Layout>
            <div className="relative min-h-screen bg-white py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <Head title={t('login_page_title') || 'Sign In'} />
                {/* Background decoration with primary color */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 opacity-5" />
                <div className="absolute -top-32 -right-40 w-96 h-96 bg-primary-500/10 blur-[200px]" />
                <div className="absolute -bottom-24 -left-32 w-96 h-96 bg-secondary-400/20 blur-[200px]" />

                <div className="relative z-10 max-w-md mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/20">
                            <Shield className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">{t('login_page_title') || 'Welcome Back'}</h2>
                            <p className="text-base sm:text-lg text-secondary-600 mt-2">
                                {t('login_page_subtitle') || 'Sign in to your account to continue'}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                            {badges.map((badge, index) => (
                                <span
                                    key={index}
                                    className="text-sm px-4 py-1.5 rounded-full border border-secondary-300 bg-secondary-50 text-primary-800 backdrop-blur"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 p-6 sm:p-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-primary-900 mb-2">
                                    {t('phone_number') || 'Phone Number'}
                                </label>
                                <div dir="ltr" className="relative">
                                    <style>{`
                                        .phone-input input {
                                            color: var(--color-primary-900) !important;
                                            font-weight: 500 !important;
                                        }
                                        .phone-input input::placeholder {
                                            color: var(--color-secondary-400) !important;
                                        }
                                    `}</style>
                                    <PhoneInput
                                        country={'sy'}
                                        value={data.phone}
                                        onChange={handlePhoneChange}
                                        inputClass="!w-full !py-3 !pr-4 !pl-12 !rounded-2xl !border !border-secondary-300 !focus:outline-none !focus:ring-2 !focus:ring-primary-500 !focus:border-primary-400 !text-base !bg-white !text-primary-900 !font-medium phone-input"
                                        buttonClass="!rounded-l-2xl !bg-secondary-50 !border-secondary-300 !focus:ring-2 !focus:ring-primary-500 !text-primary-900"
                                        containerClass="!w-full phone-input"
                                        placeholder={t('phone_number_placeholder') || 'Enter your phone number'}
                                        enableSearch
                                        inputProps={{
                                            maxLength: 17,
                                            style: {
                                                color: 'var(--color-primary-900)',
                                                fontWeight: '500',
                                            }
                                        }}
                                        style={{
                                            fontFamily: locale === 'ar' ? 'Cairo, sans-serif' : 'Inter, sans-serif',
                                        }}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing || !isPhoneValid}
                                    className="group relative w-full flex justify-center items-center gap-2 rounded-2xl bg-primary-600 hover:bg-primary-700 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            {t('sending_otp') || 'Sending OTP...'}
                                        </>
                                    ) : (
                                        <>
                                            {t('send_otp') || 'Send OTP'}
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>

                            {errors.message && (
                                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                                    {errors.message}
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="text-center">
                        <p className="text-primary-800">
                            {t('dont_have_account') || "Don't have an account?"}{' '}
                            <Link
                                href="/register"
                                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors underline decoration-2 underline-offset-4"
                            >
                                {t('sign_up_here') || 'Sign up here'}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}