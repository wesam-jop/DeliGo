import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, User, Sparkles, Store, Truck, MapPin } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Layout from '../Layout';
import { useTranslation } from '../../hooks/useTranslation';

export default function Register({ governorates = [], areas: initialAreas = [] }) {
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const { t, locale } = useTranslation();
    const { props } = usePage();
    
    // Get governorates from props if available
    const safeGovernorates = governorates || props?.governorates || [];
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        governorate_id: '',
        city_id: '',
        agree_terms: false
    });
    
    // State for cities (areas) filtered by selected governorate
    const [availableAreas, setAvailableAreas] = useState([]);
    
    // Fetch cities when governorate changes
    useEffect(() => {
        if (data.governorate_id) {
            fetch(`/api/v1/cities?governorate_id=${data.governorate_id}`)
                .then(res => res.json())
                .then(result => {
                    if (result.success) {
                        setAvailableAreas(result.data || []);
                    }
                })
                .catch(err => console.error('Error fetching cities:', err));
        } else {
            setAvailableAreas([]);
            setData('city_id', ''); // Reset city when no governorate selected
        }
    }, [data.governorate_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register');
    };

    const handlePhoneChange = (value, country) => {
        setData('phone', value);
        // Basic validation - check if phone number is valid
        // Remove country code from validation - just check if it's a reasonable length
        const phoneWithoutCode = value.replace(/\D/g, '');
        const isValid = phoneWithoutCode && phoneWithoutCode.length >= 9;
        setIsPhoneValid(isValid);
    };
    
    // Validate phone when it changes via setData
    useEffect(() => {
        if (data.phone) {
            const phoneWithoutCode = data.phone.replace(/\D/g, '');
            const isValid = phoneWithoutCode && phoneWithoutCode.length >= 9;
            setIsPhoneValid(isValid);
        }
    }, [data.phone]);

    const badges = [
        t('register_badge_fast'),
        t('register_badge_secure'),
        t('register_badge_support'),
    ];

    return (
        <Layout>
            <div className="relative min-h-screen bg-white py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <Head title={t('register_page_title')} />
                {/* Background decoration with primary color */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 opacity-5" />
                <div className="absolute -top-32 -right-40 w-96 h-96 bg-primary-500/10 blur-[200px]" />
                <div className="absolute -bottom-24 -left-32 w-96 h-96 bg-secondary-400/20 blur-[200px]" />

                <div className="relative z-10 max-w-md mx-auto space-y-8">
                    <div className="text-center space-y-4">
                        <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-xl shadow-primary-500/20">
                            <Sparkles className="h-10 w-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-primary-900">{t('register_page_title')}</h2>
                            <p className="text-base sm:text-lg text-secondary-600 mt-2">
                                {t('register_page_subtitle')}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                            {badges.map((badge) => (
                                <span
                                    key={badge}
                                    className="text-sm px-4 py-1.5 rounded-full border border-secondary-300 bg-secondary-50 text-primary-800 backdrop-blur"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-secondary-200 p-6 sm:p-10">
                        <div className="mb-6 rounded-2xl border border-primary-200 bg-gradient-to-r from-primary-50 to-secondary-50 p-5">
                            <p className="text-primary-900 font-semibold mb-4">
                                {t('register_info_banner')}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 rounded-2xl border border-primary-200 bg-white p-4 shadow-sm">
                                    <div className="p-3 rounded-2xl bg-primary-100 text-primary-700">
                                        <Store className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-primary-900 text-sm sm:text-base">
                                            {t('register_upgrade_store_title')}
                                        </p>
                                        <p className="text-xs sm:text-sm text-secondary-600">
                                            {t('register_upgrade_store_desc')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-2xl border border-accent-200 bg-white p-4 shadow-sm">
                                    <div className="p-3 rounded-2xl bg-accent-100 text-accent-700">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-primary-900 text-sm sm:text-base">
                                            {t('register_upgrade_driver_title')}
                                        </p>
                                        <p className="text-xs sm:text-sm text-secondary-600">
                                            {t('register_upgrade_driver_desc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-primary-900 mb-2">
                                    {t('full_name')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-secondary-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 rounded-2xl border border-secondary-300 text-primary-900 placeholder-secondary-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white"
                                        placeholder={t('full_name_placeholder')}
                                        disabled={processing}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary-900 mb-2">
                                    {t('phone_number')}
                                </label>
                                <div dir="ltr" className="relative">
                                    <PhoneInput
                                        country={'sy'}
                                        value={data.phone}
                                        onChange={handlePhoneChange}
                                        inputClass="!w-full !py-3 !pr-4 !pl-12 !rounded-2xl !border !border-secondary-300 !focus:outline-none !focus:ring-2 !focus:ring-primary-500 !focus:border-primary-400 !text-base !bg-white !text-primary-900"
                                        buttonClass="!rounded-l-2xl !bg-secondary-50 !border-secondary-300 !focus:ring-2 !focus:ring-primary-500"
                                        containerClass="!w-full"
                                        placeholder={t('phone_number_placeholder')}
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
                                <label className="block text-sm font-semibold text-primary-900 mb-2">
                                    {t('governorate') || 'المحافظة'} *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-secondary-400" />
                                    </div>
                                    <select
                                        value={data.governorate_id}
                                        onChange={(e) => {
                                            const govId = e.target.value;
                                            setData('governorate_id', govId);
                                            setData('city_id', ''); // Reset city when governorate changes
                                            setAvailableAreas([]); // Clear cities until new ones are loaded
                                        }}
                                        className="w-full pl-10 pr-3 py-3 rounded-2xl border border-secondary-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white appearance-none"
                                        required
                                        disabled={processing}
                                    >
                                        <option value="">{t('select_governorate') || 'اختر المحافظة'}</option>
                                        {safeGovernorates.map((gov) => (
                                            <option key={gov.id} value={gov.id}>
                                                {gov.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.governorate_id && (
                                    <p className="mt-1 text-sm text-red-500">{errors.governorate_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-primary-900 mb-2">
                                    {t('area') || 'المنطقة'} *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-secondary-400" />
                                    </div>
                                    <select
                                        value={data.city_id}
                                        onChange={(e) => setData('city_id', e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 rounded-2xl border border-secondary-300 text-primary-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-400 transition-all bg-white appearance-none disabled:bg-secondary-50 disabled:cursor-not-allowed"
                                        required
                                        disabled={processing || !data.governorate_id || availableAreas.length === 0}
                                    >
                                        <option value="">{t('select_area') || 'اختر المنطقة'}</option>
                                        {availableAreas.map((area) => (
                                            <option key={area.id} value={area.id}>
                                                {area.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {!data.governorate_id && (
                                    <p className="mt-1 text-xs text-secondary-500">{t('select_governorate_first') || 'يرجى اختيار المحافظة أولاً'}</p>
                                )}
                                {data.governorate_id && availableAreas.length === 0 && (
                                    <p className="mt-1 text-xs text-amber-600">{t('no_areas_available') || 'لا توجد مناطق متاحة في هذه المحافظة'}</p>
                                )}
                                {errors.city_id && (
                                    <p className="mt-1 text-sm text-red-500">{errors.city_id}</p>
                                )}
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agree_terms"
                                        name="agree_terms"
                                        type="checkbox"
                                        checked={data.agree_terms}
                                        onChange={(e) => setData('agree_terms', e.target.checked)}
                                        className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                        disabled={processing}
                                    />
                                </div>
                                <div className="ml-3 text-sm text-secondary-700">
                                    <label htmlFor="agree_terms">
                                        {t('terms_agree')}{' '}
                                        <Link href="/terms" className="text-primary-600 hover:text-primary-700 underline">
                                            {t('terms_of_service')}
                                        </Link>{' '}
                                        {t('terms_and')}{' '}
                                        <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                                            {t('privacy_policy')}
                                        </Link>
                                    </label>
                                    {errors.agree_terms && (
                                        <p className="mt-1 text-sm text-red-500">{errors.agree_terms}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing || !data.agree_terms || !isPhoneValid || !data.governorate_id || !data.city_id}
                                    className="group relative w-full flex justify-center items-center gap-2 rounded-2xl bg-primary-600 hover:bg-primary-700 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            {t('sending_otp')}
                                        </>
                                    ) : (
                                        <>
                                            {t('send_otp')}
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
                            {t('already_have_account')}{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors underline decoration-2 underline-offset-4"
                            >
                                {t('sign_in_here')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}