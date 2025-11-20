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
            <div className="relative min-h-screen bg-slate-950 py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <Head title={t('login_page_title') || 'Sign In'} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a0e4d] via-[#160b31] to-[#05030f]" />
                <div className="absolute -top-32 -right-40 w-96 h-96 bg-purple-500/40 blur-[200px]" />
                <div className="absolute -bottom-24 -left-32 w-96 h-96 bg-indigo-500/30 blur-[200px]" />

                <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                    <div className="text-center space-y-4 text-white">
                        <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-2xl">
                            <Shield className="h-10 w-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold">{t('login_page_title') || 'Welcome Back'}</h2>
                            <p className="text-base sm:text-lg text-purple-100 mt-2">
                                {t('login_page_subtitle') || 'Sign in to your account to continue'}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                            {badges.map((badge, index) => (
                                <span
                                    key={index}
                                    className="text-sm px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-white backdrop-blur"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('phone_number') || 'Phone Number'}
                                </label>
                                <div dir="ltr" className="relative">
                                    <PhoneInput
                                        country={'sy'}
                                        value={data.phone}
                                        onChange={handlePhoneChange}
                                        inputClass="!w-full !py-3 !pr-4 !pl-12 !rounded-2xl !border !border-slate-200 !focus:outline-none !focus:ring-2 !focus:ring-purple-500 !focus:border-transparent !text-base !bg-white"
                                        buttonClass="!rounded-l-2xl !bg-slate-50 !border-slate-200 !focus:ring-2 !focus:ring-purple-500"
                                        containerClass="!w-full"
                                        placeholder={t('phone_number_placeholder') || 'Enter your phone number'}
                                        enableSearch
                                        inputProps={{
                                            maxLength: 17,
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
                                    className="group relative w-full flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

                    <div className="text-center text-white">
                        <p>
                            {t('dont_have_account') || "Don't have an account?"}{' '}
                            <Link
                                href="/register"
                                className="font-semibold text-purple-200 hover:text-white transition-colors"
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