import React, { useState } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import Layout from '../../Layout';
import { useTranslation } from '../../../hooks/useTranslation';
import { Upload, MapPin, Store, Image as ImageIcon } from 'lucide-react';
import StoreLocationPicker from '../../../Components/StoreLocationPicker';

export default function StoreSetup() {
    const { props } = usePage();
    const storeTypes = props.storeTypes || [];
    const userPhone = props.userPhone || '';
    const { t, locale } = useTranslation();

    const [locationStatus, setLocationStatus] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        store_type: storeTypes[0]?.value || 'grocery',
        address: '',
        latitude: '',
        longitude: '',
        phone: userPhone,
        logo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/dashboard/store/setup', {
            forceFormData: true,
        });
    };

    const [logoPreview, setLogoPreview] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setData('logo', file);
        if (file) {
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setLogoPreview(null);
        }
    };

    const handleMapChange = ({ latitude, longitude }) => {
        setData('latitude', latitude);
        setData('longitude', longitude);
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus({ type: 'error', message: t('store_map_geolocate_unsupported') });
            return;
        }

        setLocationStatus({ type: 'loading', message: t('store_map_geolocate_loading') });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const lat = latitude.toFixed(6);
                const lng = longitude.toFixed(6);
                setData('latitude', lat);
                setData('longitude', lng);
                setLocationStatus({ type: 'success', message: t('store_map_geolocate_success') });
            },
            () => {
                setLocationStatus({ type: 'error', message: t('store_map_geolocate_denied') });
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <Layout>
            <Head title={t('store_setup_title')} />

            <div className="relative min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a0e4d] via-[#160b31] to-[#05030f]" />
                <div className="absolute -top-32 -right-40 w-96 h-96 bg-purple-500/40 blur-[220px]" />
                <div className="absolute -bottom-24 -left-32 w-96 h-96 bg-indigo-500/30 blur-[220px]" />

                <div className="relative z-10 max-w-4xl mx-auto space-y-8">
                    <div className="text-center text-white space-y-3">
                        <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-2xl">
                            <Store className="h-10 w-10" />
                        </div>
                        <h1 className="text-3xl font-bold">{t('store_setup_title')}</h1>
                        <p className="text-purple-100 text-base">{t('store_setup_subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/20 bg-white/95 shadow-2xl p-6 sm:p-10 space-y-8">
                        <section className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('store_name_label')}
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={t('store_name_placeholder')}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('store_type_label')}
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    {storeTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setData('store_type', type.value)}
                                            className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                                                data.store_type === type.value
                                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                                {errors.store_type && <p className="mt-1 text-sm text-red-500">{errors.store_type}</p>}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('store_address_label')}
                                </label>
                                <textarea
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    rows={3}
                                    placeholder={t('store_address_placeholder')}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                            </div>

                            <div className="space-y-3">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">{t('store_map_title')}</p>
                                        <p className="text-xs text-slate-500">{t('store_map_subtitle')}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleUseCurrentLocation}
                                        className="inline-flex items-center justify-center rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700 hover:bg-purple-100"
                                    >
                                        {t('store_map_use_location')}
                                    </button>
                                </div>
                                <StoreLocationPicker
                                    latitude={data.latitude}
                                    longitude={data.longitude}
                                    onChange={handleMapChange}
                                />
                                <p className="text-xs text-slate-500 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-purple-500" />
                                    {t('store_location_hint')}
                                </p>
                                {locationStatus && (
                                    <p
                                        className={`text-xs ${
                                            locationStatus.type === 'success'
                                                ? 'text-emerald-600'
                                                : locationStatus.type === 'loading'
                                                ? 'text-slate-500'
                                                : 'text-rose-600'
                                        }`}
                                    >
                                        {locationStatus.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {t('store_latitude_label')}
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={data.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        placeholder="33.5138"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        {t('store_longitude_label')}
                                    </label>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={data.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        placeholder="36.2765"
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('store_phone_label')}
                                </label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('store_logo_label')}
                                </label>
                                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center cursor-pointer hover:border-purple-400 transition relative overflow-hidden">
                                    {logoPreview ? (
                                        <div className="w-full flex flex-col items-center">
                                            <img
                                                src={logoPreview}
                                                alt="Store logo preview"
                                                className="w-32 h-32 object-cover rounded-xl shadow-inner"
                                            />
                                            <span className="mt-3 text-sm font-semibold text-slate-700">
                                                {data.logo?.name}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-1">{t('store_logo_hint')}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="h-8 w-8 text-purple-500" />
                                            <span className="mt-3 text-sm font-semibold text-slate-700">
                                                {t('store_logo_placeholder')}
                                            </span>
                                            <span className="text-xs text-slate-500 mt-1">{t('store_logo_hint')}</span>
                                        </>
                                    )}
                                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </label>
                                {errors.logo && <p className="mt-1 text-sm text-red-500">{errors.logo}</p>}
                            </div>
                        </section>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50"
                            >
                                {processing ? t('store_submit_processing') : t('store_submit_label')}
                            </button>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300"
                            >
                                {t('store_cancel')}
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

