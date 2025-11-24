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
            <div className="relative min-h-screen bg-slate-950 py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <Head title={t('register_page_title')} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a0e4d] via-[#160b31] to-[#05030f]" />
                <div className="absolute -top-32 -right-40 w-96 h-96 bg-purple-500/40 blur-[200px]" />
                <div className="absolute -bottom-24 -left-32 w-96 h-96 bg-indigo-500/30 blur-[200px]" />

                <div className="relative z-10 max-w-4xl mx-auto space-y-10">
                    <div className="text-center space-y-4 text-white">
                        <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-2xl">
                            <Sparkles className="h-10 w-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold">{t('register_page_title')}</h2>
                            <p className="text-base sm:text-lg text-purple-100 mt-2">
                                {t('register_page_subtitle')}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 pt-2">
                            {badges.map((badge) => (
                                <span
                                    key={badge}
                                    className="text-sm px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-white backdrop-blur"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl border border-white/30 p-6 sm:p-10">
                        <div className="mb-6 rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-indigo-50 p-5">
                            <p className="text-slate-800 font-semibold mb-4">
                                {t('register_info_banner')}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
                                    <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
                                        <Store className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm sm:text-base">
                                            {t('register_upgrade_store_title')}
                                        </p>
                                        <p className="text-xs sm:text-sm text-slate-500">
                                            {t('register_upgrade_store_desc')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                                    <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm sm:text-base">
                                            {t('register_upgrade_driver_title')}
                                        </p>
                                        <p className="text-xs sm:text-sm text-slate-500">
                                            {t('register_upgrade_driver_desc')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('full_name')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 rounded-2xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
                                        placeholder={t('full_name_placeholder')}
                                        disabled={processing}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('phone_number')}
                                </label>
                                <div dir="ltr" className="relative">
                                    <PhoneInput
                                        country={'sy'}
                                        value={data.phone}
                                        onChange={handlePhoneChange}
                                        inputClass="!w-full !py-3 !pr-4 !pl-12 !rounded-2xl !border !border-slate-200 !focus:outline-none !focus:ring-2 !focus:ring-purple-500 !focus:border-transparent !text-base !bg-white"
                                        buttonClass="!rounded-l-2xl !bg-slate-50 !border-slate-200 !focus:ring-2 !focus:ring-purple-500"
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
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('governorate') || 'المحافظة'} *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <select
                                        value={data.governorate_id}
                                        onChange={(e) => {
                                            const govId = e.target.value;
                                            setData('governorate_id', govId);
                                            setData('city_id', ''); // Reset city when governorate changes
                                            setAvailableAreas([]); // Clear cities until new ones are loaded
                                        }}
                                        className="w-full pl-10 pr-3 py-3 rounded-2xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white appearance-none"
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
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('area') || 'المنطقة'} *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <select
                                        value={data.city_id}
                                        onChange={(e) => setData('city_id', e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 rounded-2xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white appearance-none disabled:bg-slate-50 disabled:cursor-not-allowed"
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
                                    <p className="mt-1 text-xs text-slate-500">{t('select_governorate_first') || 'يرجى اختيار المحافظة أولاً'}</p>
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
                                        className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                        disabled={processing}
                                    />
                                </div>
                                <div className="ml-3 text-sm text-slate-600">
                                    <label htmlFor="agree_terms">
                                        {t('terms_agree')}{' '}
                                        <Link href="/terms" className="text-purple-600 hover:text-purple-700 underline">
                                            {t('terms_of_service')}
                                        </Link>{' '}
                                        {t('terms_and')}{' '}
                                        <Link href="/privacy" className="text-purple-600 hover:text-purple-700 underline">
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
                                    className="group relative w-full flex justify-center items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

                    <div className="text-center text-white">
                        <p>
                            {t('already_have_account')}{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-purple-200 hover:text-white transition-colors"
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